import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) return false;

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') return false;

    if (!token) return false;

    try {
      const decoded = await this.tokenService.verifyAccessToken(token);
      request['user'] = decoded;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
