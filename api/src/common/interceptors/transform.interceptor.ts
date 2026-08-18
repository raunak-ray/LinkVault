import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { PaginatedMeta } from '../pagination/paginated-response.interface';

const DEFAULT_MESSAGE = 'Request successful';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | ApiResponse<T[], PaginatedMeta>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | ApiResponse<T[], PaginatedMeta>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    const message = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((result): ApiResponse<T> | ApiResponse<T[], PaginatedMeta> => {
        if (this.isPaginatedResponse(result)) {
          return {
            success: true,
            statusCode: response.statusCode,
            message: message ?? DEFAULT_MESSAGE,
            data: result.data as T[],
            meta: result.meta,
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message: message ?? DEFAULT_MESSAGE,
          data: result,
        };
      }),
    );
  }

  private isPaginatedResponse(
    result: unknown,
  ): result is { data: unknown[]; meta: PaginatedMeta } {
    if (!result || typeof result !== 'object') return false;

    const candidate = result as Record<string, unknown>;

    return (
      Array.isArray(candidate.data) &&
      !!candidate.meta &&
      typeof candidate.meta === 'object'
    );
  }
}
