import { Module } from '@nestjs/common';
import { WeatherModule } from '../weather/weather.module';
import { ExportController } from './export.controller';

@Module({
  imports: [WeatherModule],
  controllers: [ExportController],
})
export class ExportModule {}
