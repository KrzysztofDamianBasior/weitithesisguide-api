import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { Role } from 'src/auth/roles';

export type publicUserData = {
  sub: string;
  username: string;
  roles: string[];
};

export type protectedUserData = {
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type privateUserData = {
  password: string;
};
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createOne(user: User): Promise<publicUserData & protectedUserData> {
    const newUser = new this.userModel(user);
    await newUser.save();
    const userData: publicUserData & protectedUserData = {
      sub: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    return userData;
  }

  async isUsernameExist(username: string) {
    return this.userModel.exists({ username });
  }

  async deleteById(userId: string | Types.ObjectId) {
    return this.userModel.deleteOne({ _id: userId });
  }

  async findPasswordByUsername(username: string): Promise<privateUserData> {
    const user = await this.userModel.findOne({ username }).select('password');
    const privateData: privateUserData = { password: user.password };
    return privateData;
  }

  async findPasswordById(id: string): Promise<privateUserData> {
    const user = await this.userModel.findById(id).select('password');
    const privateData: privateUserData = { password: user.password };
    return privateData;
  }

  async find({
    offset,
    perPage,
    usersFilterQuery,
  }: {
    usersFilterQuery: FilterQuery<User>;
    offset: number;
    perPage: number;
  }): Promise<(publicUserData & protectedUserData)[]> {
    const usersCollection = await this.userModel
      .find(usersFilterQuery)
      .select('_id username email roles createdAt updatedAt')
      .skip(offset)
      .limit(perPage)
      .sort({ createdAt: 'desc' });

    const filteredCollection: (publicUserData & protectedUserData)[] = [];
    for (const user of usersCollection) {
      filteredCollection.push({
        sub: user._id.toString(),
        username: user.username,
        email: user.email,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
    return filteredCollection;
  }

  async findOne(
    userFilterQuery: FilterQuery<User>,
  ): Promise<publicUserData & protectedUserData> {
    const user = await this.userModel
      .findOne(userFilterQuery)
      .select('_id username email roles createdAt updatedAt');
    const userData: publicUserData & protectedUserData = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userData;
  }

  async findOneById(
    id: string | Types.ObjectId,
  ): Promise<publicUserData & protectedUserData> {
    const user = await this.userModel
      .findById(id)
      .select('_id username email roles createdAt updatedAt');
    const userData: publicUserData & protectedUserData = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userData;
  }

  async findUsersPublicDataByTheirIds({
    ids,
    offset,
    perPage,
  }: {
    ids: string[];
    offset: number;
    perPage: number;
  }): Promise<publicUserData[]> {
    const usersCollection = await this.userModel
      .find({ _id: { $in: ids } })
      .select('_id username email')
      .skip(offset)
      .limit(perPage)
      .sort({ createdAt: 'desc' });
    const filteredCollection: publicUserData[] = [];
    for (const user of usersCollection) {
      filteredCollection.push({
        sub: user._id.toString(),
        username: user.username,
        roles: user.roles,
      });
    }
    return filteredCollection;
  }

  async findUserPublicDataById(id: string | Types.ObjectId) {
    const user = await this.userModel.findById(id).select('_id username');
    const userData: publicUserData = {
      sub: user._id.toString(),
      username: user.username,
      roles: user.roles,
    };
    return userData;
  }
  async findUserPublicAndProtectedDataById(id: string | Types.ObjectId) {
    const user = await this.userModel.findById(id).select('_id username');
    const userData: publicUserData & protectedUserData = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userData;
  }

  async updateResetLink({
    id,
    resetLink,
  }: {
    id: string | Types.ObjectId;
    resetLink: string;
  }) {
    const user = await this.userModel.findById(id);
    user.resetLink = resetLink;
    await user.save();
    return { message: 'resetLink field is set' };
  }

  async updateEmailAndRemoveResetLink({
    resetLink,
    email,
  }: {
    resetLink: string;
    email: string;
  }) {
    const user = await this.userModel.findOne({ resetLink });
    user.email = email;
    user.resetLink = '';
    await user.save();
    return { email: user.email };
  }

  async updatePasswordAndRemoveResetLink({
    resetLink,
    password,
  }: {
    resetLink: string;
    password: string;
  }): Promise<publicUserData & protectedUserData> {
    const user = await this.userModel.findOne({ resetLink });
    user.password = password;
    user.resetLink = '';
    await user.save();
    const userData: publicUserData & protectedUserData = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userData;
  }

  async updateUsername({
    id,
    username,
  }: {
    id: string | Types.ObjectId;
    username: string;
  }) {
    const user = await this.userModel.findById(id);
    user.username = username;
    await user.save();
    return { username: username };
  }

  async updatePassword({
    id,
    password,
  }: {
    id: string | Types.ObjectId;
    password: string;
  }) {
    const user = await this.userModel.findById(id);
    user.password = password;
    await user.save();
    return 'password updated';
  }

  async updateRoles({
    id,
    roles,
  }: {
    id: string | Types.ObjectId;
    roles: Role[];
  }) {
    const user = await this.userModel.findById(id);
    user.roles = roles;
    await user.save();
    return { roles: user.roles };
  }

  async forceUpdate({
    user,
    userFilterQuery,
  }: {
    userFilterQuery: FilterQuery<UserDocument>;
    user: Partial<UserDocument>;
  }): Promise<publicUserData & protectedUserData> {
    const newUser = await this.userModel.findOneAndUpdate(
      userFilterQuery,
      user,
      {
        new: true,
      },
    );
    const userData: publicUserData & protectedUserData = {
      sub: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    return userData;
  }
}
