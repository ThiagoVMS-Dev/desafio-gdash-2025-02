import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { InsightsModule } from './insights/insights.module';
import { ExportModule } from './export/export.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/weather?authSource=admin'),
    UsersModule,
    AuthModule,
    WeatherModule,
    InsightsModule,
    ExportModule,
  ],
})
export class AppModule {}
