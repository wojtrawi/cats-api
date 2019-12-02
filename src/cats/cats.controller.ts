import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

import { Permissions, PermissionsGuard } from '../auth';
import { CatsService } from './cats.service';
import { CatsPageReq, DeleteApi, GetApi, GetOneApi, PostApi } from './decorators';
import { CatDto, CreateCatDto } from './dto';
import { CatsPageRequest } from './helpers';

@Controller('cats')
@ApiUseTags('cats')
@ApiBearerAuth()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @PostApi()
  async create(@Body() createCatDto: CreateCatDto): Promise<CatDto> {
    return await this.catsService.create(createCatDto);
  }

  @Get()
  @GetApi()
  async findAll(
    @CatsPageReq() catsPageRequest: CatsPageRequest,
  ): Promise<PaginateResult<CatDto>> {
    return this.catsService.findAll(catsPageRequest);
  }

  @Get(':id')
  @GetOneApi()
  async find(@Param('id') id: string): Promise<CatDto> {
    return this.catsService.find(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:cats')
  @Delete(':id')
  @DeleteApi()
  async remove(@Param('id') id: string): Promise<CatDto> {
    return this.catsService.remove(id);
  }
}
