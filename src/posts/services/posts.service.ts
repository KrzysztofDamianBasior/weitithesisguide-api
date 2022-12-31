import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/createPostDto';
import { CreateAnswerDto } from '../dtos/createAnswerDto';
import { PostsRepository } from '../db/posts.repository';
import { Answer, Post } from '../db/posts.schema';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getPosts() {
    return this.postsRepository.findPosts({});
  }

  async getPost(postId: string) {
    return this.postsRepository.findPost({ _id: postId });
  }

  async createPost(authorId: string, createPostDto: CreatePostDto) {
    const post: Post = {
      author: authorId,
      answers: [],
      favoriteCount: 0,
      favoritedBy: [],
      question: createPostDto.question,
    };
    return this.postsRepository.createPost(post);
  }

  async createAnswer(authorId: string, createAnswerDto: CreateAnswerDto) {
    const answer: Answer = {
      author: authorId,
      content: createAnswerDto.answer,
      favoriteCount: 0,
      favoritedBy: [],
    };
    return this.postsRepository.createAnswer(createAnswerDto.postId, answer);
  }

  async toggleLikePost(postId: string, userId: string) {
    return this.postsRepository.toggleLikePost(postId, userId);
  }

  async toggleLikeAnswer(postId: string, answerId: string, userId: string) {
    return this.postsRepository.toggleLikeAnswer(postId, answerId, userId);
  }

  async deletePost(postId: string) {
    return this.postsRepository.deletePost(postId);
  }

  async deleteAnswer(postId: string, answerId: string) {
    return this.postsRepository.deleteAnswer(postId, answerId);
  }
}
