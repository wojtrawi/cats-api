import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Cat } from './cat.interface';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Cat> {
    return this.catsService.find(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:cats')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Cat> {
    return this.catsService.remove(id);
  }
}
