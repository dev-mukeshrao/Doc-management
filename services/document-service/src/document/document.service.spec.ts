import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { Repository } from 'typeorm';
import { Readable } from 'stream';

const mockFile = (name: string): Express.Multer.File => ({
  originalname: name,
  mimetype: 'application/pdf',
  size: 1234,
  filename: `${name}-${Date.now()}`,
  buffer: Buffer.from('test'),
  fieldname: 'files',
  destination: '',
  encoding: '',
  path: '',
  stream: Readable.from([]),
});

describe('DocumentService', () => {
  let service: DocumentService;
  let repo: Repository<DocumentEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repo = module.get<Repository<DocumentEntity>>(getRepositoryToken(DocumentEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadMultipleDocument', () => {
    it('should create and save documents', async () => {
      const files = [mockFile('file1.pdf'), mockFile('file2.pdf')];
      const createdDocs = files.map(file => ({ ...file, id: Math.random() }));

      mockRepository.create.mockImplementation((input) => input);
      mockRepository.save.mockResolvedValue(createdDocs);

      const result = await service.uploadMultipleDocument(files, 'test doc');

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual(createdDocs);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const docs = [{ id: 1 }, { id: 2 }];
      mockRepository.find.mockResolvedValue(docs);

      const result = await service.findAll();
      expect(result).toEqual(docs);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one document by id', async () => {
      const doc = { id: 1 };
      mockRepository.findOneBy.mockResolvedValue(doc);

      const result = await service.findOne(1);
      expect(result).toEqual(doc);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a document by id', async () => {
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);
      expect(result).toEqual(deleteResult);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
