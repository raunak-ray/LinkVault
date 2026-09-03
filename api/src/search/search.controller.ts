import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ResponseMessage('Search results')
  async search(@CurrentUser('sub') sub: string, @Query('q') q: string, @Query('limit') limit?: string) {
    const lim = limit ? Math.min(parseInt(limit, 10) || 6, 10) : 6;
    return this.searchService.globalSearch(sub, q ?? '', lim);
  }
}
