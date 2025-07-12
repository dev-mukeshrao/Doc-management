import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { Repository } from 'typeorm';

describe('DocumentModule', () => {
  let documentService: DocumentService;
  let documentController: DocumentController;

  const mockDocumentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    documentService = moduleRef.get<DocumentService>(DocumentService);
    documentController = moduleRef.get<DocumentController>(DocumentController);
  });

  it('should compile the module and inject dependencies', () => {
    expect(documentService).toBeDefined();
    expect(documentController).toBeDefined();
  });
});
