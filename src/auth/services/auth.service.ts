import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { User } from 'src/users/db/users.schema';
import { Document } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(userData: SignUpDto): Promise<{ access_token: string }> {
    const user = await this.usersService.create(userData);
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(userData: User & Document): Promise<{ access_token: string }> {
    const payload = { username: userData.username, sub: userData._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
