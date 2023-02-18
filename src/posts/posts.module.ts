import { Module } from '@nestjs/common';
import { Post, PostSchema } from './db/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
