import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

  async create(payload: any) {
    const temp = payload.tempC ?? (payload.payload && payload.payload.current_weather && payload.payload.current_weather.temperature) ?? null;
    const doc = new this.weatherModel({
      source: payload.source || 'unknown',
      latitude: payload.latitude,
      longitude: payload.longitude,
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      payload: payload.payload ?? payload,
      tempC: temp,
      humidity: payload.humidity || null,
      windSpeed: payload.windSpeed || null,
    });
    return doc.save();
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const docs = await this.weatherModel.find().sort({ timestamp: -1 }).skip(skip).limit(limit).exec();
    const total = await this.weatherModel.countDocuments().exec();
    return { data: docs, page, limit, total };
  }

  async findRange(from: Date, to: Date) {
    return this.weatherModel.find({ timestamp: { $gte: from, $lte: to } }).sort({ timestamp: 1 }).exec();
  }
}
