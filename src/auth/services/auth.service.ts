import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { User, UserDocument } from 'src/users/db/users.schema';
import { Document } from 'mongoose';
import { jwtPayload } from '../jwtPayload';
import { Role } from '../roles';
import { SendgridService } from './sendgrid.service';
import { ResetPasswordDto } from '../dtos/resetPassword.dto';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private sendgridService: SendgridService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const userPassword = await this.usersService.findPasswordByUsername(
      username,
    );

    if (userPassword && bcrypt.compare(password, userPassword)) {
      return this.usersService.findByUsername(username);
    }
    return null;
  }

  async register(userData: SignUpDto): Promise<{ access_token: string }> {
    const user = await this.usersService.create({
      username: userData.username,
      password: userData.password,
    });
    if (userData.email) {
      const resetLink = await this.sendActivateLink({
        id: user.sub.toString(),
        username: user.username,
        email: userData.email,
      });
      this.usersService.updateResetLink({ resetLink, id: user.sub });
    }

    const payload: jwtPayload = {
      username: user.username,
      sub: user.sub.toString(),
      roles: user.roles as unknown as Role[],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendActivateLink({
    id,
    username,
    email,
  }: {
    id: string;
    username: string;
    email: string;
  }) {
    const activateEmailPayload = {
      email: email,
      sub: id,
    };
    const activateEmailToken = await this.jwtService.sign(activateEmailPayload);
    this.sendgridService.activateLink({
      username,
      email,
      token: activateEmailToken,
    });
    return activateEmailToken;
  }

  async verify(token: string) {
    const decoded = this.jwtService.verify(token);
    const user = this.usersService.findById(decoded.sub);
    if (!user) {
      throw new Error('Unable to get the user from decoded token.');
    }
    return user;
  }

  async login(userData: User & Document): Promise<{ access_token: string }> {
    const payload = {
      username: userData.username,
      sub: userData._id,
      roles: userData.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async activateEmail(token: string) {
    //jwt = id + email
    const { email, sub }: { email: string; sub: string } =
      await this.jwtService.verify(token);
    if (email && sub) {
      return this.usersService.updateEmailAndRemoveResetLink({
        email,
        resetLink: token,
      });
    } else {
      throw new BadRequestException('Bad token');
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email);
    const payload = {
      id: user.sub,
      email: user.email,
      username: user.username,
    };
    const token = await this.jwtService.sign(payload);
    this.usersService.updateResetLink({ id: user.sub, resetLink: token });
    return this.sendgridService.forgetPassword({
      username: payload.username,
      email: payload.email,
      token: token,
    });
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const { username, id }: { username: string; email: string; id: string } =
      await this.jwtService.verify(token);

    const user = await this.usersService.updatePasswordAndRemoveResetLink({
      password,
      resetLink: token,
    });
    const payload = {
      username,
      sub: id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
