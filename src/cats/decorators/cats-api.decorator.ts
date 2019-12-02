import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CatDto } from '../dto/cat.dto';

export function PostApi() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'The cat has been successfully created.',
      type: CatDto,
    }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetApi() {
  return applyDecorators(
    ApiOkResponse({
      description: 'The cats list has been successfully retrieved.',
      type: [CatDto],
    }),
  );
}

export function GetOneApi() {
  return applyDecorators(
    ApiOkResponse({
      description: 'The cat has been successfully retrieved.',
      type: CatDto,
    }),
    ApiNotFoundResponse({ description: 'Cat not found' }),
  );
}

export function DeleteApi() {
  return applyDecorators(
    ApiOkResponse({
      description: 'The cat has been successfully deleted.',
      type: CatDto,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiNotFoundResponse({ description: 'Cat not found' }),
  );
}
