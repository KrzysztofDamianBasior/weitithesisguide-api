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
import { UpdateUserDto } from '../dtos/updateUserDto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles';
import { UpdateMyAccountDto } from '../dtos/updateMyAccountDto';

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
  @Patch('update-my-account')
  async updateMyAccount(
    @Request() req,
    @Body() updateUserDto: UpdateMyAccountDto,
  ) {
    return await this.usersService.edit(req.user.sub, { ...updateUserDto });
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
  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    //return this.usersService.update(id, updateUserDto)
    return this.usersService.edit(id, { ...updateUserDto });
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
    //findOne(id)
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
