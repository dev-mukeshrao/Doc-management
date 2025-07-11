import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';


@Injectable()
export class DocumentService {
    constructor(@InjectRepository(DocumentEntity) private repo: Repository<DocumentEntity>){}

    async uploadMultipleDocument(files: Express.Multer.File[], description?: string){
        const docs = files.map(file => 
            this.repo.create({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                description,
            })
        )

        return this.repo.save(docs);
    }

    async findAll(){
        return this.repo.find();
    }

    async findOne(id: number){
        return this.repo.findOneBy({id})
    }

    remove(id: number){
        return this.repo.delete(id)
    }

}
