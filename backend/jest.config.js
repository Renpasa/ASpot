const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    ...tsJestTransformCfg,
  },
  // Restoration Campaign v1 PKG-3: stale local `tsc` output under dist/
  // (untracked, gitignored) was executing twice alongside src/ and failing.
  // Exclude it so default `pnpm test` runs source suites only.
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
