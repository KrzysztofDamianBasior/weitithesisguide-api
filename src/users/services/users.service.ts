import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from '../db/users.repository';
import { User } from '../db/users.schema';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async create({
    username,
    plainTextPassword,
    email,
  }: {
    username: string;
    plainTextPassword: string;
    email?: string;
  }) {
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('SALT_LENGTH'),
    );
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    const user: User = {
      username,
      email: '',
      password: hashedPassword,
      resetLink: '',
      roles: ['User'],
    };
    if (email && email.length > 3) {
      user.email = 'waiting for verification';
      const newUser = await this.usersRepository.createOne(user);
      const token = await this.authService.sendActivateLink({
        id: newUser.sub,
        username,
        email,
      });
      return this.usersRepository.updateResetLink({
        id: newUser.sub,
        resetLink: token,
      });
    } else {
      return await this.usersRepository.createOne(user);
    }
  }

  async sendActivateLinkAndSetResetLink({
    sub,
    username,
    email,
  }: {
    sub: string;
    username: string;
    email: string;
  }) {
    const resetLink = await this.authService.sendActivateLink({
      id: sub,
      username,
      email,
    });
    return this.usersRepository.updateResetLink({ resetLink, id: sub });
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
    return this.usersRepository.findMany({
      usersFilterQuery: {},
      offset,
      perPage,
    });
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
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('SALT_LENGTH'),
    );
    return this.usersRepository.updatePasswordAndRemoveResetLink({
      password: await bcrypt.hash(password, salt),
      resetLink,
    });
  }

  async updateResetLink({ resetLink, id }: { resetLink: string; id: string }) {
    return this.usersRepository.updateResetLink({ id, resetLink });
  }

  async updatePassword({
    id,
    plainTextPassword,
  }: {
    id: string;
    plainTextPassword: string;
  }) {
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('SALT_LENGTH'),
    );
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    return this.usersRepository.updatePassword({
      id,
      password: hashedPassword,
    });
  }

  async updateUsername({ id, username }: { id: string; username: string }) {
    if (this.usersRepository.isUsernameExist(username)) {
      throw new BadRequestException('this username is already taken');
    }
    return this.usersRepository.updateUsername({ id, username });
  }

  async edit(
    id: string,
    {
      email,
      plainTextPassword,
      username,
      resetLink,
    }: {
      username?: string;
      email?: string;
      plainTextPassword?: string;
      resetLink?: string;
    },
  ) {
    const update: { [key: string]: unknown } = {};
    if (username) update.username = username;
    if (email) {
      update.email = email;
    }
    if (plainTextPassword) {
      const salt = await bcrypt.genSalt(
        this.configService.get<number>('SALT_LENGTH'),
      );
      const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
      update.password = hashedPassword;
    }
    if (resetLink || resetLink === '') update.resetLink = resetLink;

    return this.usersRepository.forceUpdate({
      user: { id: id },
      userFilterQuery: update,
    });
  }
}
