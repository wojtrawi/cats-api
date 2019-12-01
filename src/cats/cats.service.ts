import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CatFiltersConfig } from './cat-filters.config';
import { Cat } from './cat.interface';
import { CreateCatDto } from './create-cat.dto';

// function getDBFilters(filters: object) {
//   return Object.entries(filters).reduce(
//     (acc, [key, value]) => ({
//       ...acc,
//       [key]: new RegExp(value),
//     }),
//     {},
//   );
// }

@Injectable()
export class CatsService {
  constructor(@InjectModel('Cat') private readonly catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);

    return await createdCat.save();
  }

  async findAll(filtersConfig: CatFiltersConfig): Promise<Cat[]> {
    return await this.catModel.find(filtersConfig.dbFilters).exec();
  }

  async find(id: string): Promise<Cat> {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) {
      throw new NotFoundException(`Cat with id: ${id} does not exist.`);
    }

    return cat;
  }

  async remove(id: string): Promise<Cat> {
    const cat = await this.catModel.findByIdAndRemove(id).exec();

    if (!cat) {
      throw new NotFoundException(`Cat with id: ${id} does not exist.`);
    }

    return cat;
  }
}
