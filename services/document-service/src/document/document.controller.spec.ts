import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocService = {
    uploadMultipleDocument: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload multiple documents', async () => {
    const files: any[] = [{ originalname: 'file1.pdf' }, { originalname: 'file2.pdf' }];
    const dto: CreateDocumentDto = { description: 'Test upload' };

    const mockResponse = ['file1-metadata', 'file2-metadata'];

    mockDocService.uploadMultipleDocument.mockResolvedValue(mockResponse);

    const result = await controller.multiUpload(files, dto);

    expect(service.uploadMultipleDocument).toHaveBeenCalledWith(files, dto.description);
    expect(result).toEqual(mockResponse);
  });

  it('should return all documents', async () => {
    const mockDocs = [{ id: 1 }, { id: 2 }];
    mockDocService.findAll.mockResolvedValue(mockDocs);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockDocs);
  });

  it('should return a single document by ID', async () => {
    const mockDoc = { id: 1 };
    mockDocService.findOne.mockResolvedValue(mockDoc);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDoc);
  });

  it('should delete a document by ID', async () => {
    const mockResponse = { deleted: true };
    mockDocService.remove.mockResolvedValue(mockResponse);

    const result = await controller.delete(1);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResponse);
  });
});
