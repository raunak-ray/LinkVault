import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { MarkFavouriteDto } from './dto/mark-favourite.dto';
import { PaginationParams } from 'src/common/pagination/pagination.decorator';
import { type Pagination } from 'src/common/pagination/pagination.interface';

@UseGuards(AuthGuard)
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ResponseMessage('Link created successfully')
  async create(@Body() input: CreateLinkDto, @CurrentUser('sub') sub: string) {
    return await this.linksService.create(sub, input);
  }

  @Get()
  @ResponseMessage('Links retrieved successfully')
  async findAll(
    @CurrentUser('sub') sub: string,
    @PaginationParams() pagination: Pagination,
  ) {
    return await this.linksService.findAll(sub, pagination);
  }

  @Get(':id')
  @ResponseMessage('Link retrieved successfully')
  async findOne(@Param('id') id: string, @CurrentUser('sub') sub: string) {
    return await this.linksService.findById(sub, id);
  }

  @Patch(':id')
  @ResponseMessage('Link updated successfully')
  async update(
    @Param('id') id: string,
    @Body() input: UpdateLinkDto,
    @CurrentUser('sub') sub: string,
  ) {
    return await this.linksService.update(id, sub, input);
  }

  @Patch('favourite/:id')
  @ResponseMessage('Link marked as favourite successfully')
  async markFavourite(
    @Param('id') id: string,
    @Body() input: MarkFavouriteDto,
    @CurrentUser('sub') sub: string,
  ) {
    return await this.linksService.markFavourite(sub, id, input);
  }

  @Delete(':id')
  @ResponseMessage('Link deleted successfully')
  async remove(@Param('id') id: string, @CurrentUser('sub') sub: string) {
    await this.linksService.delete(sub, id);

    return null;
  }
}
