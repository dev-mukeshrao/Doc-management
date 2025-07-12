import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trigger', () => {
    it('should call ingestionService.triggerIngestion with filename and return result', async () => {
      const filename = 'data.csv';
      const result = { success: true };

      mockIngestionService.triggerIngestion.mockResolvedValue(result);

      const response = await controller.trigger(filename);

      expect(service.triggerIngestion).toHaveBeenCalledWith(filename);
      expect(response).toEqual(result);
    });
  });
});
