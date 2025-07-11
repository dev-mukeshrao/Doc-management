import { Injectable, NotFoundException, UnsupportedMediaTypeException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionEntity } from './ingestion.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionEntity)
    private readonly ingestionRepo: Repository<IngestionEntity>,
  ) {}

  async triggerIngestion(filename: string): Promise<IngestionEntity> {
    const filePath = path.join(__dirname, '../../../../public/uploads', filename);
    if (!filePath) {
      throw new NotFoundException('Document not found!');
    }


    if (!filename.endsWith('.pdf')) {
    const failedIngestion = this.ingestionRepo.create({
      filename,
      status: 'FAILED'
    });
      await this.ingestionRepo.save(failedIngestion);
      throw new UnsupportedMediaTypeException('Ingestion failed: unsupported media/file type');
    }

    try {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);

      const ingestion = this.ingestionRepo.create({
        filename,
        status: 'SUCCESS',
        wordCount: data.text.split(/\s+/).length,
        pageCount: data.numpages,
        textPreview: data.text.slice(0, 500),
      });

      return await this.ingestionRepo.save(ingestion);
    } catch (err) {
      const failedIngestion = this.ingestionRepo.create({
        filename,
        status: 'FAILED',
      });
      await this.ingestionRepo.save(failedIngestion);
      throw new InternalServerErrorException(`Ingestion failed: ${err.message}`);
    }
  }
}
