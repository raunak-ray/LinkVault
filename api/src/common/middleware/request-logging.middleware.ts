import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const userId = (req as AuthenticatedRequest).user?.sub ?? 'anonymous';

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms user=${userId}`,
      );
    });

    next();
  }
}
