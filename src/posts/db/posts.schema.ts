import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from 'src/users/db/users.schema';

export type PostDocument = HydratedDocument<Post>;
export type AnswerDocument = HydratedDocument<Answer>;

// Nested Schema
@Schema({ timestamps: true })
export class Answer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ type: String })
  content: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: Number, default: 0 })
  favoriteCount: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    required: true,
  })
  favoritedBy: UserDocument[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// Parent schema
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: [AnswerSchema], default: [] })
  answers: AnswerDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ type: String })
  question: string;

  @Prop({ type: Number, default: 0 })
  favoriteCount: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  })
  favoritedBy: UserDocument[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
