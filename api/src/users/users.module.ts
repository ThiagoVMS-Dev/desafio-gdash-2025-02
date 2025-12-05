import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  constructor(private readonly usersService: UsersService, private readonly config: ConfigService) {}

  async onModuleInit() {
    const email = this.config.get('DEFAULT_ADMIN_EMAIL') || 'admin@example.com';
    const pass = this.config.get('DEFAULT_ADMIN_PASSWORD') || '123456';
    const exists = await this.usersService.findByEmail(email);
    if (!exists) {
      try {
        await this.usersService.create({ email, password: pass, roles: ['admin'] });
        console.log('Default admin created:', email);
      } catch (err) {
        console.error('Failed creating default admin', err);
      }
    } else {
      console.log('Default admin already exists');
    }
  }
}
