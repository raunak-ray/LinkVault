import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CollectionsService } from './collections.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PaginationParams } from 'src/common/pagination/pagination.decorator';
import { type Pagination } from 'src/common/pagination/pagination.interface';
import { SortingParams } from 'src/common/sorting/sorting.decorator';
import { Sorting } from 'src/common/sorting/sorting.interface';

@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Get()
  @ResponseMessage('Collections fetched successfully')
  async getCollections(
    @CurrentUser('sub') sub: string,
    @PaginationParams() paginationInput: Pagination,
    @SortingParams(['createdAt', 'name']) sortingInput: Sorting[] | null,
  ) {
    return await this.collectionService.findAll(
      sub,
      paginationInput,
      sortingInput,
    );
  }

  @Get(':id')
  @ResponseMessage('Collection fetched successfully')
  async getCollectionById(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
  ) {
    return await this.collectionService.findById(sub, id);
  }

  @Post()
  @ResponseMessage('Collection created successfully')
  async createCollection(
    @CurrentUser('sub') sub: string,
    @Body() input: CreateCollectionDto,
  ) {
    return await this.collectionService.create(sub, input);
  }

  @Patch(':id')
  @ResponseMessage('Collection updated successfully')
  async updateCollection(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
    @Body() input: UpdateCollectionDto,
  ) {
    return await this.collectionService.update(sub, id, input);
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
