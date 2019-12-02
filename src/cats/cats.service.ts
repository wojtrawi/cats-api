import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';

import { CreateCatDto } from './dto/create-cat.dto';
import { CatEntity } from './entity/cat.entity';
import { CatsPageRequest } from './helpers/cats-page-request';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel('Cat') private readonly catModel: PaginateModel<CatEntity>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<CatEntity> {
    const createdCat = new this.catModel(createCatDto);

    return await createdCat.save();
  }

  async findAll(
    catsPageRequest: CatsPageRequest,
  ): Promise<PaginateResult<CatEntity>> {
    return await catsPageRequest.getResponse(this.catModel);
  }

  async find(id: string): Promise<CatEntity> {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) {
      throw new NotFoundException(`Cat with id: ${id} does not exist.`);
    }

    return cat;
  }

  async remove(id: string): Promise<CatEntity> {
    const cat = await this.catModel.findByIdAndRemove(id).exec();

    if (!cat) {
      throw new NotFoundException(`Cat with id: ${id} does not exist.`);
    }

    return cat;
  }
}
