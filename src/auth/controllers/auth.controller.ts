import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignUpGuard } from '../guards/signUp.guard';
import { SignInDto } from '../dtos/signIn.dto';
import { SignUpDto } from '../dtos/signUp.dto';
import { SendgridService } from '../services/sendgrid.service';
import { Roles } from '../roles';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';
import { ResetPasswordDto } from '../dtos/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sendgridService: SendgridService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(SignUpGuard)
  @Post('signup')
  async signup(@Request() req, @Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Post('send')
  async sendEmail(@Query('email') email) {
    const mail = {
      to: email,
      subject: 'Greeting Message from NestJS Sendgrid',
      from: '<send_grid_email_address>',
      text: 'Hello World from NestJS Sendgrid',
      html: '<h1>Hello World from NestJS Sendgrid</h1>',
    };

    return await this.sendgridService.send(mail);
  }

  @Patch('activate-email/:token')
  async activateEmail(@Param('token') token: string) {
    return this.authService.activateEmail(token);
  }

  @Patch('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
