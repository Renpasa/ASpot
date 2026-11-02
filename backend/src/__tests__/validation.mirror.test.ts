import fs from 'fs';
import path from 'path';

describe('Validation Utility Mirroring', () => {
  it('should ensure backend and frontend validation.util.ts are byte-identical', () => {
    // Navigate up from backend/src/__tests__ to project root, then to specific files
    const rootPath = path.resolve(__dirname, '../../../');
    const backendUtilPath = path.join(rootPath, 'backend/src/utils/validation.util.ts');
    const frontendUtilPath = path.join(rootPath, 'frontend/src/utils/validation.util.ts');

    expect(fs.existsSync(backendUtilPath)).toBe(true);
    expect(fs.existsSync(frontendUtilPath)).toBe(true);

    const backendContent = fs.readFileSync(backendUtilPath);
    const frontendContent = fs.readFileSync(frontendUtilPath);

    expect(backendContent.equals(frontendContent)).toBe(true);
  });
});
