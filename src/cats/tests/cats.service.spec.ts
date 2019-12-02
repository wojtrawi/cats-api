import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { CatsService } from '../cats.service';
import { CatDto } from '../dto';
import { CatsPageRequest } from '../helpers';

const mockCatDto: CatDto = { _id: 'xyz', name: 'Kitten' };

class MockCatModel {
  paginate = jest.fn();
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
      catModel.paginate.mockResolvedValue([mockCatDto]);

      const cats = await service.findAll(new CatsPageRequest({}));

      expect(catModel.paginate).toHaveBeenCalledTimes(1);
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

      await expect(service.find(mockCatDto._id)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      await expect(service.find(mockCatDto._id)).rejects.toHaveProperty(
        'message.message',
        `Cat with id: ${mockCatDto._id} does not exist.`,
      );
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

      await expect(service.remove(mockCatDto._id)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      await expect(service.remove(mockCatDto._id)).rejects.toHaveProperty(
        'message.message',
        `Cat with id: ${mockCatDto._id} does not exist.`,
      );
    });
  });
});
