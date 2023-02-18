import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../db/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async create({
    authorId,
    content,
    postId,
  }: {
    authorId: string;
    content: string;
    postId: string;
  }) {
    return this.commentsRepository.create({ authorId, content, postId });
  }

  async findOne({ commentId, postId }: { postId: string; commentId: string }) {
    return this.commentsRepository.findOne({ postId, commentId });
  }

  async update({
    commentId,
    postId,
    content,
  }: {
    commentId: string;
    postId: string;
    content: string;
  }) {
    return this.commentsRepository.update({ commentId, postId, content });
  }

  remove({ postId, commentId }: { postId: string; commentId: string }) {
    return this.commentsRepository.remove({ commentId, postId });
  }

  async toggleLike({
    postId,
    userId,
    commentId,
  }: {
    postId: string;
    userId: string;
    commentId: string;
  }) {
    return this.commentsRepository.toggleLike({ postId, userId, commentId });
  }
}
