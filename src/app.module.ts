import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// kolekcje: users, posts, notes

// users: {
// 	username: string,
// 	email: string,
// 	password: string,
// 	resetLink: string,
// 	activityHistory: Schema.ObjectId[]
// }
// posts: {
// 	creator: Schema.ObjectId,
// 	title: string,
// 	question: string,
// 	favouritedBy: Schema.ObjectId[]
// 	favoritedCount: number
// 	updatedAt: Date
// 	createdAt: Date

// 	answers: {
// 		author: Schema.ObjectId,
// 		content: String
// 		favouritedBy: Schema.ObjectId
// 		favoritedCount: number
// 		updatedAt: Date
// 		createdAt: Date
// 	}
// }
// notes: {
// 	author: string
// 	content: string
// 	updatedAt: Date
// 	createdAt: Date
// }
