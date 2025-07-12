// document.interceptor.ts
import { UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";

export function CustomDocumentInterceptor(fieldName: string) {
  return UseInterceptors(FilesInterceptor(fieldName, 10, {
    storage: diskStorage({
      destination: path.resolve(__dirname, '../../../../public/uploads'),
      filename: (req, file, cb) => {
        cb(null, generateCustomFilename(file.originalname));
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }));
}

export function generateCustomFilename(originalname: string): string {
  const name = originalname?.split('.')[0] || 'file';
  const ext = path.extname(originalname);
  return `${name}-${Date.now()}${ext}`;
}
