import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

export type limitedUserDataType = {
  sub: string;
  username: string;
  email: string;
  dateOfRegistration: string;
  roles: string[];
};

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createOne(
    user: User,
    limitedOutput = true,
  ): Promise<UserDocument | limitedUserDataType> {
    const newUser = new this.userModel(user);
    await newUser.save();
    if (limitedOutput && newUser) {
      return {
        sub: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        dateOfRegistration: newUser.dateOfRegistration,
        roles: newUser.roles,
      };
    } else {
      return newUser;
    }
  }

  async deleteOne(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }

  async find(
    usersFilterQuery: FilterQuery<User>,
    limitedOutput = true,
  ): Promise<UserDocument[] | limitedUserDataType[]> {
    const usersCollection = await this.userModel.find(usersFilterQuery);
    if (limitedOutput && usersCollection) {
      const filteredCollection = [];
      for (const user of usersCollection) {
        filteredCollection.push({
          sub: user._id.toString(),
          username: user.username,
          email: user.email,
          dateOfRegistration: user.dateOfRegistration,
        });
      }
      return filteredCollection;
    } else {
      return usersCollection;
    }
  }

  async findOne(
    userFilterQuery: FilterQuery<User>,
    limitedOutput = true,
  ): Promise<UserDocument | limitedUserDataType> {
    const newUser = await this.userModel.findOne(userFilterQuery);
    if (newUser && limitedOutput) {
      return {
        sub: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        dateOfRegistration: newUser.dateOfRegistration,
        roles: newUser.roles,
      };
    } else {
      return newUser;
    }
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
    limitedOutput = true,
  ): Promise<UserDocument | limitedUserDataType> {
    const newUser = await this.userModel.findOneAndUpdate(
      userFilterQuery,
      user,
      {
        new: true,
      },
    );
    if (newUser && limitedOutput) {
      return {
        sub: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        dateOfRegistration: newUser.dateOfRegistration,
        roles: newUser.roles,
      };
    } else {
      return newUser;
    }
  }
}
