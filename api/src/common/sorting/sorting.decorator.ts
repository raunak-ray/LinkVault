import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Sorting } from './sorting.interface';

export const SortingParams = createParamDecorator(
  (validParams: string[], ctx: ExecutionContext): Sorting[] | null => {
    const request: Request = ctx.switchToHttp().getRequest();

    const sort = request.query.sort as string;

    if (!sort) return null;

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    const sortingParams = sort.split(',').map((sortParam) => {
      if (!sortParam.match(sortPattern)) {
        throw new BadRequestException(`Invalid sort parameter: ${sortParam}`);
      }

      const [field, order] = sortParam.split(':') as [string, 'asc' | 'desc'];

      if (!validParams.includes(field)) {
        throw new BadRequestException(`Invalid sort parameter: ${field}`);
      }

      return { field, order };
    });

    return sortingParams;
  },
);
