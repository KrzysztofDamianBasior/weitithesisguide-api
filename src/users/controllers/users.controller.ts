import {
  Body,
  Get,
  Controller,
  Patch,
  Request,
  UseGuards,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles';
import { UpdateUsernameDto } from '../dtos/updateUsernameDto';
import { UpdateEmailDto } from '../dtos/updateEmailDto';
import { UpdatePasswordDto } from '../dtos/updatePasswordDto';

@Roles('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('my-account')
  async getMyAccount(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update-my-username')
  async updateMyUsername(
    @Request() req,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return await this.usersService.updateUsername({
      id: req.user.sub,
      username: updateUsernameDto.username,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update-my-email')
  async updateMyEmail(@Request() req, @Body() updateEmailDto: UpdateEmailDto) {
    return await this.usersService.sendActivateLinkAndSetResetLink({
      sub: req.user.sub,
      email: updateEmailDto.email,
      username: req.user.username,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update-my-password')
  async updateMyPassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword({
      id: req.user.sub,
      plainTextPassword: updatePasswordDto.password,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('delete-my-account')
  deleteMyAccount(@Request() req) {
    return this.usersService.remove(req.user.sub);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Get('?')
  findAll(@Query('offset') offset: number, @Query('per_page') perPage: number) {
    //users?offset=1&per_page=3
    return this.usersService.all({ offset, perPage });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Patch('grant-admin-permissions/:id')
  grantAdminPermissions(@Param('id') id: string) {
    return this.usersService.grantAdminPermissions(id);
  }
}
