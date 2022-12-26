import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../db/users.repository';
import { User } from '../db/users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email?: string;
  }) {
    const user: User = {
      username,
      email: email ? email : '',
      password,
      resetLink: '',
      dateOfRegistration: new Date().toString(),
      roles: [],
    };
    return this.usersRepository.createOne(user);
  }

  async remove(userId: string) {
    return this.usersRepository.deleteOne(userId);
  }

  async get(userId: string): Promise<User> {
    return this.usersRepository.findOne({ userId });
  }

  async all(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async edit({
    id,
    email,
    password,
    username,
  }: {
    id: string;
    username?: string;
    email?: string;
    password?: string;
  }) {
    const update: { [key: string]: unknown } = {};
    if (username) update.username = username;
    if (email) update.email = username;
    if (password) update.password = username;

    this.usersRepository.findOneAndUpdate({ _id: id }, update);
  }
}
