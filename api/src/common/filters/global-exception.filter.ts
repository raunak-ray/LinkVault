import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  Logger,
} from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { Request, Response } from 'express';
import { getDbError } from '../errors/db-error-mapper';
import { PostgresError } from '../interfaces/postgres-error.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.path;
    const method = request.method;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : ((exceptionResponse as HttpExceptionBody).message ??
            exception.message);

      if (status >= 500) {
        this.logger.error(
          `Request failed: ${method} ${path} - ${status}`,
          exception.stack,
        );
      } else {
        this.logger.warn(
          `Request failed: ${method} ${request.originalUrl} - ${status}`,
        );
      }

      response.status(status).json({
        success: false,
        statusCode: status,
        message,
        timestamp,
        path,
        method,
      });
      return;
    }

    if (exception instanceof DrizzleQueryError) {
      const cause = exception.cause;

      if (this.isPostgresError(cause)) {
        const dbError = getDbError(cause);

        this.logger.error(
          `Postgres error: ${cause.message} code: ${cause.code} constraint: ${cause.constraint ?? 'none'}`,
        );

        response.status(dbError.statusCode).json({
          success: false,
          statusCode: dbError.statusCode,
          message: dbError.message,
          timestamp,
          path,
          method,
        });
        return;
      }
    }

    this.logger.error(
      `Unhandled exception: ${method} ${path}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp,
      path,
      method,
    });
  }

  private isPostgresError(exception: unknown): exception is PostgresError {
    if (!exception || typeof exception !== 'object') return false;

    const error = exception as PostgresError;

    return typeof error.code === 'string' && /^[0-9A-Z]{5}$/.test(error.code);
  }
}
