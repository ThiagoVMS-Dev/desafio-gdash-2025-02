import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { WeatherModule } from '../weather/weather.module';
import { InsightsController } from './insights.controller';

@Module({
  imports: [WeatherModule],
  providers: [InsightsService],
  controllers: [InsightsController],
  exports: [InsightsService],
})
export class InsightsModule {}
