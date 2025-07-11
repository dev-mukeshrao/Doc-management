import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import  { extname } from "path";
 


export function CustomDocumentInterceptor(fieldName: string){
    return UseInterceptors(FilesInterceptor(fieldName,10, {
        storage: diskStorage({
             destination: path.resolve(__dirname, '../../../../public/uploads'),
            filename: (req, file, cb) => {
                const name = file.originalname?.split('.')[0] || 'file';
                const ext = extname(file.originalname);
                cb(null, `${name}-${Date.now()}${ext}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024}, 
    }))
}