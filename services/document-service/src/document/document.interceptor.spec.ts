import { generateCustomFilename } from './document.interceptor';

describe('generateCustomFilename', () => {
  it('should generate a filename with the original name and timestamp', () => {
    const originalname = 'report.pdf';
    const result = generateCustomFilename(originalname);

    // Match pattern like: report-1720701823956.pdf
    expect(result).toMatch(/^report-\d+\.pdf$/);
  });

  it('should fallback to "file" if original name is missing', () => {
    const result = generateCustomFilename('');
    expect(result).toMatch(/^file-\d+$/);
  });

  it('should preserve the extension for other file types', () => {
    const originalname = 'image.jpeg';
    const result = generateCustomFilename(originalname);

    expect(result).toMatch(/^image-\d+\.jpeg$/);
  });
});
