import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Document } from 'mongoose';

import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createOne(user: User): Promise<User & Document> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async deleteOne(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }

  async find(
    usersFilterQuery: FilterQuery<User>,
  ): Promise<(User & Document)[]> {
    return this.userModel.find(usersFilterQuery);
  }

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User & Document> {
    return this.userModel.findOne(userFilterQuery);
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User & Document> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      new: true,
    });
  }
}
