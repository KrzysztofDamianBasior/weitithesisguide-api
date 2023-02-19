import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../db/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create({ authorId, content }: { authorId: string; content: string }) {
    return this.postsRepository.create({ authorId, content });
  }

  async findMany({ offset, perPage }: { offset: number; perPage: number }) {
    return this.postsRepository.findAll({ offset, perPage });
  }

  async findOne(id: string) {
    return this.postsRepository.findOne(id);
  }

  async update({ id, content }: { id: string; content: string }) {
    return this.postsRepository.updateContent({ id, content });
  }

  async remove(id: string) {
    this.postsRepository.remove(id);
  }

  async toggleLike({ postId, userId }: { postId: string; userId: string }) {
    return this.postsRepository.toggleLike({ postId, userId });
  }

  async verifyPostAuthor({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }) {
    const post = await this.postsRepository.findOne(postId);
    if (post.author.toString() !== userId) {
      throw new ForbiddenException(
        'not enough privileges to perform an action on a resource',
      );
    }
    return true;
  }
}
