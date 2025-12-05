import { Controller, Get, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('api/insights')
export class InsightsController {
  constructor(private readonly svc: InsightsService) {}

  @Get()
  async get(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) return { error: 'from and to query params required, ISO dates recommended' };
    return this.svc.generateForRange(from, to);
  }
}
