import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../db/users.repository';
import { User } from '../db/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(
    {
      username,
      password,
      email,
    }: {
      username: string;
      password: string;
      email?: string;
    },
    limitedOutput = true,
  ) {
    const salt = await bcrypt.genSalt(10);
    const user: User = {
      username,
      email: email ? email : '',
      password: await bcrypt.hash(password, salt),
      resetLink: '',
      dateOfRegistration: new Date().toString(),
      roles: ['User'],
    };

    return this.usersRepository.createOne(user, limitedOutput);
  }

  async remove(userId: string) {
    return this.usersRepository.deleteOne(userId);
  }

  async grantAdminPermissions(id, limitedOutput = true) {
    return this.usersRepository.findOneAndUpdate(
      { _id: id },
      { roles: ['User', 'Admin'] },
      limitedOutput,
    );
  }

  async findById(userId: string, limitedOutput = true) {
    return this.usersRepository.findOne({ _id: userId }, limitedOutput);
  }

  async findByUsername(username: string, limitedOutput = true) {
    return this.usersRepository.findOne({ username }, limitedOutput);
  }

  async all(limitedOutput = true) {
    return this.usersRepository.find({}, limitedOutput);
  }

  async edit(
    {
      id,
      email,
      password,
      username,
    }: {
      id: string;
      username?: string;
      email?: string;
      password?: string;
    },
    limitedOutput = true,
  ) {
    const update: { [key: string]: unknown } = {};
    if (username) update.username = username;
    if (email) update.email = username;
    if (password) update.password = username;

    return this.usersRepository.findOneAndUpdate(
      { _id: id },
      update,
      limitedOutput,
    );
  }
}
