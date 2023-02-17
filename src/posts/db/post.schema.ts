import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Comment, CommentDocument, CommentSchema } from './comment.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [CommentSchema], default: [], required: true })
  comments: (Comment | CommentDocument)[];

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
