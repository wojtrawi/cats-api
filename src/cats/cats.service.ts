import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';

import { CatsGateway } from './cats.gateway';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatEntity } from './entity/cat.entity';
import { CatsPageRequest } from './helpers/cats-page-request';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel('Cat') private readonly catModel: PaginateModel<CatEntity>,
    private readonly catsGateway: CatsGateway,
  ) {}

  async create(createCatDto: CreateCatDto, userId: string): Promise<CatEntity> {
    const createdCat = await new this.catModel({
      ...createCatDto,
      userId,
    }).save();

    this.catsGateway.notifyAll();

    return createdCat;
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

  async remove(
    id: string,
    { sub: userId, scope }: { sub: string; scope?: string },
  ): Promise<CatEntity> {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) {
      throw new NotFoundException(`Cat with id: ${id} does not exist.`);
    }

    if (cat.userId !== userId && !this.isAdmin(scope)) {
      throw new ForbiddenException(
        `Cat with id: ${id} does not belong the user.`,
      );
    }

    return await cat.remove();
  }

  private isAdmin(scope?: string): boolean {
    return scope && scope.split(' ').includes('delete:cats');
  }
}
