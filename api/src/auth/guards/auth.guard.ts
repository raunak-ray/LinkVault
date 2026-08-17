import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type');
    }

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const decoded = await this.tokenService.verifyAccessToken(token);
      request.user = decoded;
    } catch {
      this.logger.warn(
        `Access denied on ${request.method} ${request.url}: invalid or expired token`,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
