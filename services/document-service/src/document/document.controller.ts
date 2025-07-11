import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentEntity } from './document.entity';
import { CustomDocumentInterceptor } from './document.interceptor';
import { CreateDocumentDto } from './dto/create-document.dto';
@Controller('document')
export class DocumentController {

    constructor(private docService: DocumentService){}


    @Post('upload')
    @CustomDocumentInterceptor('files')
    async multiUpload(@UploadedFiles() files: Express.Multer.File[], @Body() fileDetails: CreateDocumentDto){
        return this.docService.uploadMultipleDocument(files, fileDetails.description)
    }

    @Get()
    findAll(){
        return this.docService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number){
        return this.docService.findOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: number){
        return this.docService.remove(id);
    }

}
