import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersRepository } from '../db/users.repository';
import { User } from '../db/users.schema';
import * as bcrypt from 'bcrypt';
import { SendgridService } from 'src/auth/services/sendgrid.service';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(
    {
      username,
      password,
    }: {
      username: string;
      password: string;
    },
    limitedOutput = true,
  ) {
    const salt = await bcrypt.genSalt(10);
    const user: User = {
      username,
      email: '',
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

  async findByEmail(email: string, limitedOutput = true) {
    return this.usersRepository.findOne({ email }, limitedOutput);
  }

  async findByResetLink(resetLink: string, limitedOutput = true) {
    return this.usersRepository.find({ resetLink }, limitedOutput);
  }

  async all(limitedOutput = true) {
    return this.usersRepository.find({}, limitedOutput);
  }

  async edit(
    id: string,
    {
      email,
      password,
      username,
      resetLink,
    }: {
      username?: string;
      email?: string;
      password?: string;
      resetLink?: string;
    },
    { limitedOutput = true, sendEmail = false },
  ) {
    const update: { [key: string]: unknown } = {};
    if (username) update.username = username;
    if (email) {
      update.email = email;
      if (sendEmail) {
        this.authService.sendActivateLink({ id, username, email });
      }
    }
    if (password) update.password = username;
    if (resetLink || resetLink === '') update.resetLink = resetLink;

    return this.usersRepository.findOneAndUpdate(
      { _id: id },
      update,
      limitedOutput,
    );
  }
}
