import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CollectionsService } from './collections.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Get()
  @ResponseMessage('Collections fetched successfully')
  async getCollections(
    @CurrentUser('sub') sub: string,
    @Query() paginationInput: PaginationDto,
  ) {
    const data = await this.collectionService.findAll(sub, paginationInput);

    return data;
  }

  @Get(':id')
  @ResponseMessage('Collection fetched successfully')
  async getCollectionById(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
  ) {
    const data = await this.collectionService.findById(sub, id);

    return data;
  }

  @Post()
  @ResponseMessage('Collection created successfully')
  async createCollection(
    @CurrentUser('sub') sub: string,
    @Body() input: CreateCollectionDto,
  ) {
    const data = await this.collectionService.create(sub, input);

    return data;
  }

  @Patch(':id')
  @ResponseMessage('Collection updated successfully')
  async updateCollection(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
    @Body() input: UpdateCollectionDto,
  ) {
    const data = await this.collectionService.update(sub, id, input);

    return data;
  }

  @Delete(':id')
  @ResponseMessage('Collection deleted successfully')
  async deleteCollection(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
  ) {
    await this.collectionService.delete(sub, id);

    return null;
  }
}
