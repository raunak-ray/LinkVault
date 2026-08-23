import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponse } from './interface/dashboard-response';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ResponseMessage('Dashboard data fetched successfully')
  async getDashboard(
    @CurrentUser('sub') sub: string,
  ): Promise<DashboardResponse> {
    return this.dashboardService.getDashboardData(sub);
  }
}
