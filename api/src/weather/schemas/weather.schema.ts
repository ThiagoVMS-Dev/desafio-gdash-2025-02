import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema({ timestamps: true })
export class Weather {
  @Prop({ required: true })
  source: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  timestamp: Date;

  @Prop({ type: Object })
  payload: any;

  @Prop()
  tempC?: number;

  @Prop()
  humidity?: number;

  @Prop()
  windSpeed?: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
