import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionEntity } from './ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngestionEntity])],
  providers: [IngestionService],
  controllers: [IngestionController]
})
export class IngestionModule {}
