import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const created = new this.userModel(dto);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const u = await this.userModel.findById(id).exec();
    if (!u) throw new NotFoundException();
    return u;
  }

  async update(id: string, payload: Partial<CreateUserDto>) {
    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }
    return this.userModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validateUser(email: string, pass: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }
}
