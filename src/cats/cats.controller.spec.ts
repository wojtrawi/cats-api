import { Test, TestingModule } from '@nestjs/testing';

import { CatDto } from './cat.dto';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';

const mockCatDto: CatDto = { _id: 'xyz', name: 'Kitten' };

class MockCatsService {
  create = jest.fn();
  findAll = jest.fn();
  find = jest.fn();
  remove = jest.fn();
}

describe('Cats Controller', () => {
  let controller: CatsController;
  let catsService: MockCatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useClass: MockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create cat', async () => {
      const createCatDto: CreateCatDto = { name: mockCatDto.name };
      catsService.create.mockResolvedValue(mockCatDto);

      const createdCat = await controller.create(createCatDto);

      expect(catsService.create).toHaveBeenCalledTimes(1);
      expect(catsService.create).toHaveBeenCalledWith(createCatDto);
      expect(createdCat).toEqual(mockCatDto);
    });
  });

  describe('findAll', () => {
    it('should return cats', async () => {
      catsService.findAll.mockResolvedValue([mockCatDto]);

      const cats = await controller.findAll();

      expect(catsService.findAll).toHaveBeenCalledTimes(1);
      expect(cats).toEqual([mockCatDto]);
    });
  });

  describe('find', () => {
    it('should return cat', async () => {
      catsService.find.mockResolvedValue(mockCatDto);

      const cat = await controller.find(mockCatDto._id);

      expect(catsService.find).toHaveBeenCalledTimes(1);
      expect(catsService.find).toHaveBeenCalledWith(mockCatDto._id);
      expect(cat).toEqual(mockCatDto);
    });
  });

  describe('remove', () => {
    it('should remove cat', async () => {
      catsService.remove.mockResolvedValue(mockCatDto);

      const removedCat = await controller.remove(mockCatDto._id);

      expect(catsService.remove).toHaveBeenCalledTimes(1);
      expect(catsService.remove).toHaveBeenCalledWith(mockCatDto._id);
      expect(removedCat).toEqual(mockCatDto);
    });
  });
});
