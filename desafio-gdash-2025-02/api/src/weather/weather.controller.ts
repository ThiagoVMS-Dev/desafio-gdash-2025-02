import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const token = req.headers['x-api-token'] || '';
    if (token !== process.env.WORKER_API_TOKEN) {
      throw new UnauthorizedException('Invalid worker token');
    }
    return this.service.create(body);
  }

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.service.findAll(parseInt(page), parseInt(limit));
  }
}
