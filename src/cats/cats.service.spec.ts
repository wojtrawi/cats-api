import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { CatDto } from './cat.dto';
import { CatsService } from './cats.service';

const mockCatDto: CatDto = { _id: 'xyz', name: 'Kitten' };

class MockCatModel {
  find = jest.fn();
  findById = jest.fn();
  findByIdAndRemove = jest.fn();
}

describe('CatsService', () => {
  let service: CatsService;
  let catModel: MockCatModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getModelToken('Cat'),
          useClass: MockCatModel,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    catModel = module.get<MockCatModel>(getModelToken('Cat'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cats', async () => {
      catModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue([mockCatDto]),
      }));

      const cats = await service.findAll();

      expect(catModel.find).toHaveBeenCalledTimes(1);
      expect(cats).toEqual([mockCatDto]);
    });
  });

  describe('find', () => {
    it('should return cat when valid id has been passed', async () => {
      catModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockCatDto),
      }));

      const cat = await service.find(mockCatDto._id);

      expect(catModel.findById).toHaveBeenCalledTimes(1);
      expect(catModel.findById).toHaveBeenCalledWith(mockCatDto._id);
      expect(cat).toEqual(mockCatDto);
    });

    it('should throw NotFoundException when invalid id has been passed', async () => {
      catModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      let error;

      try {
        const cat = await service.find(mockCatDto._id);
      } catch (e) {
        error = e;
      }

      expect(catModel.findById).toHaveBeenCalledTimes(1);
      expect(catModel.findById).toHaveBeenCalledWith(mockCatDto._id);
      expect(error instanceof NotFoundException).toBe(true);
      expect(error.message.message).toContain(mockCatDto._id);
    });
  });

  describe('remove', () => {
    it('should return cat when valid id has been passed', async () => {
      catModel.findByIdAndRemove.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockCatDto),
      }));

      const removedCat = await service.remove(mockCatDto._id);

      expect(catModel.findByIdAndRemove).toHaveBeenCalledTimes(1);
      expect(catModel.findByIdAndRemove).toHaveBeenCalledWith(mockCatDto._id);
      expect(removedCat).toEqual(mockCatDto);
    });

    it('should throw NotFoundException when invalid id has been passed', async () => {
      catModel.findByIdAndRemove.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      let error;

      try {
        const cat = await service.remove(mockCatDto._id);
      } catch (e) {
        error = e;
      }

      expect(catModel.findByIdAndRemove).toHaveBeenCalledTimes(1);
      expect(catModel.findByIdAndRemove).toHaveBeenCalledWith(mockCatDto._id);
      expect(error instanceof NotFoundException).toBe(true);
      expect(error.message.message).toContain(mockCatDto._id);
    });
  });
});
