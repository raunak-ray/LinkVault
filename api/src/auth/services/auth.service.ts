import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('auth');
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(input: RegisterUserDto) {
    const existingUser = await this.userService.findByEmail(input.email);

    if (existingUser) {
      this.logger.warn(`Failed registration attempt for email: ${input.email}`);
      throw new ConflictException('User with this email already exists');
    }

    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, SALT);

    const user = await this.userService.create({
      ...input,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.issueTokenPair({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`Successful registration for email: ${input.email}`);

    return { ...user, ...tokens };
  }

  async loginUser(input: LoginUserDto) {
    const user = await this.userService.findByEmailWithPassword(input.email);

    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${input.email}`);
      throw new ConflictException('Invalid credentials');
    }

    const passwordsMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordsMatch) {
      this.logger.warn(`Failed login attempt for email: ${input.email}`);
      throw new ConflictException('Invalid credentials');
    }

    const tokens = await this.tokenService.issueTokenPair({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`Successful login for email: ${input.email}`);
    return { ...user, ...tokens, password: undefined };
  }
}
