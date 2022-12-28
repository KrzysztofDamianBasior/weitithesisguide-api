import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { User, UserDocument } from 'src/users/db/users.schema';
import { Document } from 'mongoose';
import { jwtPayload } from '../jwtPayload';
import { Role } from '../roles';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = (await this.usersService.findByUsername(
      username,
      false,
    )) as UserDocument;
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async register(userData: SignUpDto): Promise<{ access_token: string }> {
    const user = (await this.usersService.create(
      userData,
      false,
    )) as UserDocument;
    const payload: jwtPayload = {
      username: user.username,
      sub: user._id.toString(),
      roles: user.roles as unknown as Role[],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
}
