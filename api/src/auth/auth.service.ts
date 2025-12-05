import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const u = await this.usersService.findByEmail(email);
    if (!u) return null;
    const valid = await (await import('bcrypt')).compare(pass, u.password);
    if (!valid) return null;
    const obj = u.toObject();
    delete obj.password;
    return obj;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }),
    };
  }
}
