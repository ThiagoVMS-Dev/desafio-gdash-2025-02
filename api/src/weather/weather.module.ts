import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }])],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
