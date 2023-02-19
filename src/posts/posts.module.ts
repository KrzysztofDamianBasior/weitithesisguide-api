import { Module } from '@nestjs/common';
import { Post, PostSchema } from './db/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { CommentsService } from './services/comments.service';
import { PostsRepository } from './db/posts.repository';
import { CommentsRepository } from './db/comments.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  providers: [
    PostsService,
    CommentsService,
    PostsRepository,
    CommentsRepository,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
