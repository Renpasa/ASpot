import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, access, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';

const frontendDir = path.resolve(import.meta.dirname, '..');

async function chromiumPath() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const root = '/home/mysti/.cache/ms-playwright';
  const entries = await readdir(root, { withFileTypes: true });
  const candidates = entries.filter((entry) => entry.isDirectory() && /^chromium-\d+$/.test(entry.name))
    .sort((a, b) => Number(b.name.slice(9)) - Number(a.name.slice(9)));
  for (const entry of candidates) {
    const candidate = path.join(root, entry.name, 'chrome-linux', 'chrome');
    try { await access(candidate); return candidate; } catch {}
  }
  throw new Error('No Playwright Chromium binary found');
}

async function waitForPreview(child) {
  let output = '';
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Vite preview did not start: ${output}`)), 15000);
    const onData = (chunk) => {
      output += chunk.toString();
      const match = output.match(/https?:\/\/127\.0\.0\.1:(\d+)/);
      if (match) { clearTimeout(timer); child.stdout.off('data', onData); resolve(`http://127.0.0.1:${match[1]}`); }
    };
    child.stdout.on('data', onData);
    child.once('error', (error) => { clearTimeout(timer); reject(error); });
    child.once('exit', (code) => { clearTimeout(timer); reject(new Error(`Preview exited ${code}: ${output}`)); });
  });
}

async function cdpSocket(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  const events = new Set();
  ws.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) { const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); }
    else for (const handler of events) handler(message);
  });
  return {
    ws,
    send(method, params = {}) { const id = ++nextId; return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); }); },
    onEvent(handler) { events.add(handler); return () => events.delete(handler); },
  };
}

async function startBrowser(width, height) {
  const dir = await mkdtemp(path.join(tmpdir(), 'mobile-header-'));
  const preview = spawn('pnpm', ['exec', 'vite', 'preview', '--port', '0', '--host', '127.0.0.1'], { cwd: frontendDir, stdio: ['ignore', 'pipe', 'pipe'] });
  let chrome;
  try {
    const origin = await waitForPreview(preview);
    chrome = spawn(await chromiumPath(), ['--headless=new', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${width},${height}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'ignore'] });
    let address = '';
    const devtoolsFile = path.join(dir, 'DevToolsActivePort');
    for (let i = 0; i < 100; i++) {
      try { address = (await (await import('node:fs/promises')).readFile(devtoolsFile, 'utf8')).split('\n')[0]; break; } catch { await delay(50); }
    }
    assert.ok(address, 'Chromium remote debugging endpoint started');
    const targets = await (await fetch(`http://127.0.0.1:${address}/json/new?about:blank`, { method: 'PUT' })).json();
    const cdp = await cdpSocket(targets.webSocketDebuggerUrl);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*localhost:3000/api/*', requestStage: 'Request' }] });
    cdp.onEvent(async (event) => {
      if (event.method !== 'Fetch.requestPaused') return;
      const { requestId, request, resourceType } = event.params;
      const url = new URL(request.url);
      if (request.method === 'OPTIONS') {
        await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: [{ name: 'Access-Control-Allow-Origin', value: '*' }, { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' }, { name: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' }] });
      } else if (url.pathname === '/api/spots' && request.method === 'GET') {
        const body = JSON.stringify([{ id: 1, title: 'Sample spot', description: 'Sample', lat: 40.7, lng: -74, imageUrl: 'https://example.com/photo.jpg', createdAt: new Date().toISOString(), userId: 1, username: 'testuser' }]);
        await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(body).toString('base64') });
      } else if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const submitted = JSON.parse(request.postData || '{}');
        const username = submitted.username || (submitted.email === 'coolphotographer@example.com' ? 'coolphotographer' : 'testuser');
        const body = JSON.stringify({ token: 'test-jwt', user: { id: 1, username, email: submitted.email || 'test@example.com' } });
        await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(body).toString('base64') });
      } else {
        await cdp.send('Fetch.continueRequest', { requestId });
      }
    });
    await cdp.send('Page.enable');
    await cdp.send('Page.navigate', { url: origin });
    await delay(800);
    return { cdp, origin, async close() { cdp.ws.close(); chrome.kill('SIGTERM'); preview.kill('SIGTERM'); preview.stdout.destroy(); preview.stderr.destroy(); setTimeout(() => { chrome.kill('SIGKILL'); preview.kill('SIGKILL'); }, 1000).unref(); await rm(dir, { recursive: true, force: true }); } };
  } catch (error) {
    chrome?.kill('SIGTERM'); preview.kill('SIGTERM'); preview.stdout.destroy(); preview.stderr.destroy(); setTimeout(() => { chrome?.kill('SIGKILL'); preview.kill('SIGKILL'); }, 1000).unref(); await rm(dir, { recursive: true, force: true }); throw error;
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function login(browser, username = 'testuser') {
  await evaluate(browser.cdp, `document.querySelector('button') && [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Login / Register').click()`);
  await evaluate(browser.cdp, `(() => { const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; const email=document.querySelector('input[type=email]'), password=document.querySelector('input[type=password]'); set.call(email,'${username === 'testuser' ? 'test@example.com' : 'coolphotographer@example.com'}'); email.dispatchEvent(new Event('input',{bubbles:true})); set.call(password,'password'); password.dispatchEvent(new Event('input',{bubbles:true})); document.querySelector('form').requestSubmit(); })()`);
  for (let i = 0; i < 50; i++) { if (await evaluate(browser.cdp, `!![...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Logout')`)) return; await delay(100); }
  throw new Error('Login did not complete');
}

async function metrics(cdp) {
  return evaluate(cdp, `(() => { const h=document.querySelector('header'), hr=h.getBoundingClientRect(); return {headerWidth:h.scrollWidth, docWidth:document.documentElement.scrollWidth, headerRect:{top:hr.top,bottom:hr.bottom}, buttons:[...h.querySelectorAll('button')].filter(b=>b.getClientRects().length).map(b=>({text:b.textContent.trim(),...(()=>{const r=b.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width}})()})), welcome:[...h.querySelectorAll('span')].find(s=>s.textContent.includes('Welcome'))?.getBoundingClientRect().width||0, lowerLeft:h.nextElementSibling.querySelector('div').getBoundingClientRect().left }; })()`);
}

test('mobile and desktop logged-in header fits viewport', async (t) => {
  const mobile = await startBrowser(390, 844);
  t.after(() => mobile.close());
  await login(mobile);
  let m = await metrics(mobile.cdp);
  assert.ok(m.headerWidth <= 390, `AC-1 mobile logged-in header scrollWidth ${m.headerWidth} > 390`);
  assert.ok(m.docWidth <= 390, `AC-1 document scrollWidth ${m.docWidth} > 390`);
  for (const button of m.buttons) assert.ok(button.left >= 0 && button.right <= 390 && button.top >= m.headerRect.top && button.bottom <= m.headerRect.bottom, `AC-1 ${button.text} clipped: ${JSON.stringify(button)}`);

});

test('AC-2 mobile creation header fits viewport', async (t) => {
  const mobile = await startBrowser(390, 844);
  t.after(() => mobile.close());
  await login(mobile);
  await evaluate(mobile.cdp, `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Add Spot').click()`);
  let m = await metrics(mobile.cdp);
  assert.ok(m.headerWidth <= 390, `AC-2 header scrollWidth ${m.headerWidth} > 390`);
  assert.ok(m.docWidth <= 390, `AC-2 document scrollWidth ${m.docWidth} > 390`);
  for (const text of ['Cancel Add Spot', 'Logout']) { const b=m.buttons.find(x=>x.text===text); assert.ok(b && b.left>=0 && b.right<=390 && b.top>=m.headerRect.top && b.bottom<=m.headerRect.bottom, `AC-2 ${text} clipped: ${JSON.stringify(b)}`); }
  assert.ok(m.lowerLeft >= 0, `AC-2 lower pane left ${m.lowerLeft} < 0`);

});

test('AC-3 long username mobile header fits viewport', async (t) => {
  const long = await startBrowser(390, 844);
  t.after(() => long.close());
  let m;
  await evaluate(long.cdp, `localStorage.setItem('token','test-jwt'); localStorage.setItem('user',JSON.stringify({id:1,username:'coolphotographer',email:'test@example.com'})); location.reload()`);
  await delay(700);
  await evaluate(long.cdp, `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Add Spot').click()`);
  m = await metrics(long.cdp);
  assert.ok(m.headerWidth <= 390, `AC-3 header scrollWidth ${m.headerWidth} > 390`);
  const logout=m.buttons.find(b=>b.text==='Logout');
  assert.ok(logout && logout.width>30 && logout.right<=390, `AC-3 Logout clipped: ${JSON.stringify(logout)}`);

});

test('AC-4 desktop logged-in and mobile logged-out headers fit viewport', async (t) => {
  const opened = [];
  let m;
  t.after(async () => { for (const browser of opened) await browser.close(); });
  const desktop = await startBrowser(1440, 900); opened.push(desktop);
  await login(desktop);
  m=await metrics(desktop.cdp);
  assert.ok(m.headerWidth<=1440, `AC-4 desktop header scrollWidth ${m.headerWidth} > 1440`);
  assert.ok(m.welcome>0, 'AC-4 Welcome, testuser is not visible');
  for(const button of m.buttons) assert.ok(button.left>=0 && button.right<=1440, `AC-4 ${button.text} clipped`);

  const loggedOut=await startBrowser(390,844); opened.push(loggedOut);
  m=await metrics(loggedOut.cdp);
  assert.ok(m.headerWidth<=390, `AC-4 logged-out mobile header scrollWidth ${m.headerWidth} > 390`);
});
