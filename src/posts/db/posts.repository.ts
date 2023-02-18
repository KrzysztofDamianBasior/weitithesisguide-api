import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UsersRepository } from 'src/users/db/users.repository';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create({
    authorId,
    content,
  }: {
    authorId: string | Types.ObjectId;
    content: string;
  }): Promise<PostDocument> {
    const payload: Post = {
      author: authorId,
      content,
      comments: [],
      favoriteCount: 0,
      favoritedBy: [],
    };
    const newPost = new this.postModel(payload);
    await newPost.save();
    return newPost;
  }

  async remove(id: string | Types.ObjectId) {
    return this.postModel.deleteOne({ id });
  }

  async find(postsFilterQuery: FilterQuery<Post>): Promise<PostDocument[]> {
    return this.postModel.find(postsFilterQuery);
  }

  async findAll({ offset, perPage }: { offset: number; perPage: number }) {
    return this.postModel
      .find()
      .skip(offset)
      .limit(perPage)
      .sort({ createdAt: 'desc' });
  }

  async findOne(_id: string | Types.ObjectId): Promise<PostDocument> {
    return await this.postModel.findById(_id);
  }

  async toggleLike({ postId, userId }: { postId: string; userId: string }) {
    const post = await this.postModel.findById(postId);
    const hasUser = post.favoritedBy.map((id) => id.toString()).indexOf(userId);
    if (hasUser >= 0) {
      return this.postModel.findByIdAndUpdate(
        postId,
        {
          $pull: { favoritedBy: new mongoose.Types.ObjectId(userId) },
          $inc: { favoriteCount: -1 },
        },
        { new: true },
      );
    } else {
      return this.postModel.findByIdAndUpdate(
        postId,
        {
          $push: { favoritedBy: new mongoose.Types.ObjectId(userId) },
          $inc: { favoriteCount: 1 },
        },
        { new: true },
      );
    }
  }

  async update(
    postFilterQuery: FilterQuery<Post>,
    post: Partial<Post>,
  ): Promise<PostDocument> {
    return this.postModel.findOneAndUpdate(postFilterQuery, post, {
      new: true,
    });
  }

  async updateContent({
    id,
    content,
  }: {
    id: string | Types.ObjectId;
    content: string;
  }) {
    const post = await this.postModel.findById(id);
    post.content = content;
    return post.save();
  }

  async findUsersWhoLikePost({
    postId,
    offset,
    perPage,
  }: {
    postId: string;
    offset: number;
    perPage: number;
  }) {
    const post = await this.postModel.findById(postId);
    return this.usersRepository.findUsersPublicDataByTheirIds({
      ids: post.favoritedBy.map((id) => id.toString()),
      offset,
      perPage,
    });
  }

  async findPostAuthor(postId: string) {
    const post = await this.postModel.findById(postId);
    return this.usersRepository.findOne({
      _id: post.author,
    });
  }
}
