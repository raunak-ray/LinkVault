import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from './pagination.interface';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const PaginationParams = createParamDecorator(
  (_, ctx: ExecutionContext): Pagination => {
    const request: Request = ctx.switchToHttp().getRequest();

    const rawPage = request.query.page;
    const rawLimit = request.query.limit;

    const page = rawPage === undefined ? DEFAULT_PAGE : Number(rawPage);
    const limit = rawLimit === undefined ? DEFAULT_LIMIT : Number(rawLimit);

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException(
        'Invalid page number. Page must be a positive integer.',
      );
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException(
        'Invalid limit. Limit must be a positive integer.',
      );
    }

    const maxLimit = limit > MAX_LIMIT ? MAX_LIMIT : limit;
    const offset = (page - 1) * maxLimit;

    return { page, limit: maxLimit, offset };
  },
);
