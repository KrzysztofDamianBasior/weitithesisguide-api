import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from './db/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './db/users.schema';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
