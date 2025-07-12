import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestionEntity } from './ingestion.entity';

describe('IngestionModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(IngestionEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });
});
