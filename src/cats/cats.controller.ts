import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CatFiltersConfig } from './cat-filters.config';
import { CatFilters } from './cat-filters.decorator';
import { CatDto } from './cat.dto';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';

@ApiUseTags('cats')
@ApiBearerAuth()
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    description: 'The cat has been successfully created.',
    type: CatDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() createCatDto: CreateCatDto): Promise<CatDto> {
    return await this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The cats list has been successfully retrieved.',
    type: [CatDto],
  })
  async findAll(
    @CatFilters
    filtersConfig: CatFiltersConfig,
  ): Promise<CatDto[]> {
    return this.catsService.findAll(filtersConfig);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The cat has been successfully retrieved.',
    type: CatDto,
  })
  @ApiNotFoundResponse({ description: 'Cat not found' })
  async find(@Param('id') id: string): Promise<CatDto> {
    return this.catsService.find(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:cats')
  @Delete(':id')
  @ApiOkResponse({
    description: 'The cat has been successfully deleted.',
    type: CatDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Cat not found' })
  async remove(@Param('id') id: string): Promise<CatDto> {
    return this.catsService.remove(id);
  }
}
