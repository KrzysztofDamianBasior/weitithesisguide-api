import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from './db/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './db/users.schema';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
