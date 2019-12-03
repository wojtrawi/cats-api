import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

import { User } from '../shared';
import { CatsService } from './cats.service';
import { CatsPageReq, DeleteApi, GetApi, GetOneApi, PostApi } from './decorators';
import { CreateCatDto } from './dto';
import { CatEntity } from './entity';
import { CatsPageRequest } from './helpers';
import { CatsPageTransformInterceptor, CatTransformInterceptor } from './interceptors';

@Controller('cats')
@UseGuards(AuthGuard('jwt'))
@ApiUseTags('cats')
@ApiBearerAuth()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @UseInterceptors(CatTransformInterceptor)
  @Post()
  @PostApi()
  async create(
    @Body() createCatDto: CreateCatDto,
    @User('sub') userId: string,
  ): Promise<CatEntity> {
    return await this.catsService.create(createCatDto, userId);
  }

  @UseInterceptors(CatsPageTransformInterceptor)
  @Get()
  @GetApi()
  async findAll(
    @CatsPageReq() catsPageRequest: CatsPageRequest,
  ): Promise<PaginateResult<CatEntity>> {
    return this.catsService.findAll(catsPageRequest);
  }

  @UseInterceptors(CatTransformInterceptor)
  @Get(':id')
  @GetOneApi()
  async find(@Param('id') id: string): Promise<CatEntity> {
    return this.catsService.find(id);
  }

  @UseInterceptors(CatTransformInterceptor)
  @Delete(':id')
  @DeleteApi()
  async remove(
    @Param('id') id: string,
    @User() user: { sub: string; scope?: string },
  ): Promise<CatEntity> {
    return this.catsService.remove(id, user);
  }
}
