import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @ResponseMessage('User profile updated successfully')
  @Patch('me')
  async updateMe(
    @CurrentUser('sub') sub: string,
    @Body() input: UpdateUserDto,
  ) {
    const data = await this.userService.update(sub, input);

    return data;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage('Account deleted successfully')
  @Delete('me')
  async deleteMe(@CurrentUser('sub') sub: string) {
    await this.userService.softDelete(sub);

    return null;
  }
}
