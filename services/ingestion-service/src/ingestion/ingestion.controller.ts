import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
    constructor(private ingestionService: IngestionService){}

    @Post()
    async trigger(@Body('filename') filename: string){
       return this.ingestionService.triggerIngestion(filename) 
    }
}
