import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateUserDto from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.UserModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }
}
