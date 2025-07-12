import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { IngestionEntity } from './ingestion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UnsupportedMediaTypeException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as fs from 'fs/promises';
import pdfParse from 'pdf-parse';

jest.mock('fs/promises');

jest.mock('pdf-parse', () => {
  return {
    __esModule: true,
    default: jest.fn(), // <-- export default mock function
  };
});

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionRepo: Repository<IngestionEntity>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(IngestionEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionRepo = module.get<Repository<IngestionEntity>>(getRepositoryToken(IngestionEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('should process a valid PDF file successfully', async () => {
  //   const filename = 'test.pdf';

  //   const mockPdfData = {
  //     text: 'This is a test PDF document with some text.',
  //     numpages: 2,
  //   };

  //   // Mock fs.readFile to return a fake buffer
  //  // (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('pdf-content'));

  //   // Mock pdf-parse to return fake parsed content
  //   const pdfParseMock = pdfParse as jest.MockedFunction<typeof pdfParse>;
  //   pdfParseMock.mockResolvedValue(mockPdfData);

  //   const mockEntity = {
  //     filename,
  //     status: 'SUCCESS',
  //     wordCount: 8,
  //     pageCount: 2,
  //     textPreview: mockPdfData.text.slice(0, 500),
  //   };

  //   mockRepo.create.mockReturnValue(mockEntity);
  //   mockRepo.save.mockResolvedValue(mockEntity);

  //   const result = await service.triggerIngestion(filename);

  //   expect(fs.readFile).toHaveBeenCalledWith(expect.stringContaining('test.pdf'));
  //   expect(pdfParse).toHaveBeenCalled();
  //   expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
  //     filename,
  //     status: 'SUCCESS',
  //   }));
  //   expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
  //   expect(result).toEqual(mockEntity);
  // });

  it('should fail for non-PDF file', async () => {
    const filename = 'test.txt';
    const mockEntity = { filename, status: 'FAILED' };

    mockRepo.create.mockReturnValue(mockEntity);
    mockRepo.save.mockResolvedValue(mockEntity);

    await expect(service.triggerIngestion(filename)).rejects.toThrow(UnsupportedMediaTypeException);

    expect(mockRepo.create).toHaveBeenCalledWith({ filename, status: 'FAILED' });
    expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
  });

  it('should throw InternalServerErrorException when read/parse fails', async () => {
    const filename = 'test.pdf';

    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));

    const mockEntity = { filename, status: 'FAILED' };
    mockRepo.create.mockReturnValue(mockEntity);
    mockRepo.save.mockResolvedValue(mockEntity);

    await expect(service.triggerIngestion(filename)).rejects.toThrow(InternalServerErrorException);

    expect(mockRepo.create).toHaveBeenCalledWith({ filename, status: 'FAILED' });
    expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
  });
});
