import { Module } from '@nestjs/common';

import { IngestionModule } from './ingestion/ingestion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionEntity } from './ingestion/ingestion.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'sqlite',
    database: 'db.sqlite',
    entities: [IngestionEntity],
    synchronize: true,
  })
    ,IngestionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
