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

  async create({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email?: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    const user: User = {
      username,
      email: '',
      password: await bcrypt.hash(password, salt),
      resetLink: '',
      roles: ['User'],
    };
    if (email && email.length > 3) {
      user.email = 'waiting for verification';
      const newUser = await this.usersRepository.createOne(user);
      this.authService.sendActivateLink({ id: newUser.sub, username, email });
      return newUser;
    } else {
      return await this.usersRepository.createOne(user);
    }
  }

  async findPasswordByUsername(username: string) {
    return this.usersRepository.findPasswordByUsername(username);
  }

  async remove(userId: string) {
    return this.usersRepository.deleteById(userId);
  }

  async grantAdminPermissions(id) {
    return this.usersRepository.updateRoles({ id, roles: ['User', 'Admin'] });
  }

  async findById(id: string) {
    return this.usersRepository.findOneById(id);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ username });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async findByResetLink(resetLink: string) {
    return this.usersRepository.findOne({ resetLink });
  }

  async all({ offset, perPage }: { offset: number; perPage: number }) {
    return this.usersRepository.find({ usersFilterQuery: {}, offset, perPage });
  }
  async updateEmailAndRemoveResetLink({
    resetLink,
    email,
  }: {
    resetLink: string;
    email: string;
  }) {
    return this.usersRepository.updateEmailAndRemoveResetLink({
      email,
      resetLink,
    });
  }
  async updatePasswordAndRemoveResetLink({
    resetLink,
    password,
  }: {
    resetLink: string;
    password: string;
  }) {
    return this.usersRepository.updatePasswordAndRemoveResetLink({
      password,
      resetLink,
    });
  }

  async updateResetLink({ resetLink, id }: { resetLink: string; id: string }) {
    return this.usersRepository.updateResetLink({ id, resetLink });
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    return this.usersRepository.updatePassword({ id, password });
  }

  async updateUsername({ id, username }: { id: string; username: string }) {
    if (!this.usersRepository.isUsernameExist(username)) {
      this.usersRepository.updateUsername({ id, username });
    } else {
      return 'this username is already taken';
    }
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
  ) {
    const update: { [key: string]: unknown } = {};
    if (username) update.username = username;
    if (email) {
      update.email = email;
    }
    if (password) update.password = username;
    if (resetLink || resetLink === '') update.resetLink = resetLink;

    return this.usersRepository.forceUpdate({
      user: { id: id },
      userFilterQuery: update,
    });
  }
}
