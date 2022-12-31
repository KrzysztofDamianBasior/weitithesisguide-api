import { Module } from '@nestjs/common';
import { Post, PostSchema } from './db/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
})
export class PostsModule {}
