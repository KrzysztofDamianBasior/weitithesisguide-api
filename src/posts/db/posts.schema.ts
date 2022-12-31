import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;
export type AnswerDocument = HydratedDocument<Answer>;

// Nested Schema
@Schema({ timestamps: true })
export class Answer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: Number, default: 0, required: true })
  favoriteCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: true,
      },
    ],
  })
  favoritedBy: Types.ObjectId[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// Parent schema
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: [AnswerSchema], default: [], required: true })
  answers: (Answer | AnswerDocument)[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: Number, default: 0, required: true })
  favoriteCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: true,
      },
    ],
  })
  favoritedBy: Types.ObjectId[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
