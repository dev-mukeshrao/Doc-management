import { Module } from '@nestjs/common';
import { DocumentModule } from './document/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document/document.entity';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [DocumentEntity],
    synchronize:true,
  })
    ,DocumentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
