import { Module } from '@nestjs/common';
import { Post, PostSchema } from './db/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { PostsService } from './services/posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  providers: [PostsService],
})
export class PostsModule {}
