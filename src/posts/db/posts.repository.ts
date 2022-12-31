import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Answer, AnswerDocument, Post, PostDocument } from './posts.schema';
import { UsersRepository } from 'src/users/db/users.repository';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createPost(post: Post): Promise<PostDocument> {
    const newPost = new this.postModel(post);
    await newPost.save();
    return newPost;
  }

  async deletePost(postId: string) {
    return this.postModel.deleteOne({ _id: postId });
  }

  async findPosts(
    postsFilterQuery: FilterQuery<Post>,
  ): Promise<PostDocument[]> {
    return this.postModel.find(postsFilterQuery);
  }

  async findPost(postFilterQuery: FilterQuery<Post>): Promise<PostDocument> {
    return await this.postModel.findOne(postFilterQuery);
  }

  async findPostAndUpdate(
    postFilterQuery: FilterQuery<Post>,
    post: Partial<Post>,
  ): Promise<PostDocument> {
    return this.postModel.findOneAndUpdate(postFilterQuery, post, {
      new: true,
    });
  }

  async createAnswer(postId: string, answer: Answer) {
    const post = await this.postModel.findById(postId);
    post.answers.push(answer);
    return post.save();
  }

  async deleteAnswer(postId: string, answerId: string) {
    const post = await this.postModel.findById(postId);
    const answers = post.answers as AnswerDocument[];
    answers.filter((answer) => answer._id.toString() === answerId);
    return post.save();
  }

  async findAnswer(postId: string, answerId: string) {
    const post = await this.postModel.findById(postId);
    const answers = post.answers as AnswerDocument[];
    return answers.find((answer) => answer._id.toString() === answerId);
  }

  async findUsersWhoLikePost(postId: string) {
    const post = await this.postModel.findById(postId);
    return this.usersRepository.find({
      _id: { $in: post.favoritedBy },
    });
  }

  async findPostAuthor(postId: string) {
    const post = await this.postModel.findById(postId);
    return this.usersRepository.findOne({
      _id: post.author,
    });
  }

  async findUsersWhoLikeAnswer(postId: string, answerId: string) {
    const post = await this.postModel.findById(postId);
    const answers = post.answers as AnswerDocument[];
    const selectedAnswer = answers.find(
      (answer) => answer._id.toString() === answerId,
    );
    return this.usersRepository.find({
      _id: { $in: selectedAnswer.favoritedBy },
    });
  }

  async findAnswerAuthor(postId: string, answerId: string) {
    const post = await this.postModel.findById(postId);
    const answers = post.answers as AnswerDocument[];
    const selectedAnswer = answers.find(
      (answer) => answer._id.toString() === answerId,
    );
    return this.usersRepository.find({
      _id: selectedAnswer.author,
    });
  }
}
