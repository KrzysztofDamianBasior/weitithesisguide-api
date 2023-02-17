import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { Comment, CommentDocument, CommentSchema } from './comment.schema';
import { UsersRepository } from 'src/users/db/users.repository';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async toggleLike({
    commentId,
    postId,
    userId,
  }: {
    postId: Types.ObjectId | string;
    commentId: Types.ObjectId | string;
    userId: Types.ObjectId | string;
  }) {
    const post = await this.postModel.findById(postId);
    const commentIndex = post.comments.findIndex(
      (answer: CommentDocument) =>
        answer._id.toString() == commentId.toString(),
    );

    const hasUser = post.comments[commentIndex].favoritedBy
      .map((id) => id.toString())
      .indexOf(userId.toString());

    if (hasUser >= 0) {
      post.comments[commentIndex].favoritedBy.splice(hasUser, 1);
      post.comments[commentIndex].favoriteCount -= 1;
    } else {
      post.comments[commentIndex].favoritedBy.push(
        new mongoose.Types.ObjectId(userId),
      );
      post.comments[commentIndex].favoriteCount += 1;
    }

    return post.save();
  }
  async create({
    postId,
    author,
    content,
  }: {
    postId: Types.ObjectId | string;
    author: Types.ObjectId | string;
    content: string;
  }) {
    const comment: Comment = {
      author,
      content,
      favoriteCount: 0,
      favoritedBy: [],
    };
    const post = await this.postModel.findById(postId);
    post.comments.push(comment);
    return post.save();
  }

  async update({
    postId,
    commentId,
    content,
  }: {
    postId: Types.ObjectId | string;
    commentId: Types.ObjectId | string;
    content: string;
  }) {
    const post = await this.postModel.findById(postId);
    const comment = post.comments.find(
      (answer: CommentDocument) =>
        answer._id.toString() == commentId.toString(),
    );
    comment.content = content;
    return post.save();
  }

  async remove({
    postId,
    commentId,
  }: {
    postId: Types.ObjectId | string;
    commentId: Types.ObjectId | string;
  }): Promise<Comment> {
    const post = await this.postModel.findById(postId);
    const commentIndex = post.comments.findIndex(
      (answer: CommentDocument) =>
        answer._id.toString() == commentId.toString(),
    );
    const comment = post.comments[commentIndex];
    post.comments.splice(commentIndex);
    await post.save();
    return comment;
  }

  async find({
    commentId,
    postId,
  }: {
    postId: Types.ObjectId | string;
    commentId: Types.ObjectId | string;
  }): Promise<Comment> {
    const post = await this.postModel.findById(postId);
    return post.comments.find(
      (answer: CommentDocument) =>
        answer._id.toString() === commentId.toString(),
    );
  }

  async findUsersWhoLikeComment({
    commentId,
    postId,
    offset,
    perPage,
  }: {
    postId: Types.ObjectId | string;
    commentId: Types.ObjectId | string;
    offset: number;
    perPage: number;
  }) {
    const post = await this.postModel.findById(postId);
    const comment = post.comments.find(
      (answer: CommentDocument) =>
        answer._id.toString() === commentId.toString(),
    );
    return this.usersRepository.findUsersPublicDataByTheirIds({
      ids: comment.favoritedBy.map((id) => id.toString()),
      offset,
      perPage,
    });
  }
}
