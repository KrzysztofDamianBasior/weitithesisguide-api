import { Module } from '@nestjs/common';
import { Post, PostSchema } from './db/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
})
export class PostsModule {}
