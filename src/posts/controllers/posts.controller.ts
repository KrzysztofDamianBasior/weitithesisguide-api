import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dtos/createPostDto';
import { Roles } from 'src/auth/roles';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/createCommentDto';

@Roles('User')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create({
      authorId: req.user.sub,
      content: createPostDto.content,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create({
      authorId: req.user.sub,
      content: createCommentDto.content,
      postId: id,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('?')
  findAllPosts(
    @Query('offset') offset: number,
    @Query('per_page') perPage: number,
  ) {
    //users?offset=1&per_page=3
    return this.postsService.findMany({ offset, perPage });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOnePost(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments/:commentId')
  findOneComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.findOne({ commentId, postId });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Patch(':id')
  updatePostContent(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.update({ content: createPostDto.content, id });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':postId/comments/:commentId')
  updateCommentContent(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req,
    @Body() updateCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.update({
      commentId,
      content: updateCommentDto.content,
      postId,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Delete(':postId/comments/:commentId')
  removeComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove({ postId, commentId });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put('likes/:id')
  toggleLike(@Param('id') id, @Request() req) {
    return this.postsService.toggleLike({ postId: id, userId: req.user.sub });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':postId/comments/:commentId/likes')
  toggleCommentLike(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.commentsService.toggleLike({
      postId,
      commentId,
      userId: req.user.sub,
    });
  }
}
