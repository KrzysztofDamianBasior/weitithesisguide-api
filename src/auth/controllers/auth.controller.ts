import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignUpGuard } from '../guards/signUp.guard';
import { SignInDto } from '../dtos/signIn.dto';
import { SignUpDto } from '../dtos/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
