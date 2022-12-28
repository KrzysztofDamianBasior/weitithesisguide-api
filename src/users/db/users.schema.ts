import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: String, required: true })
  dateOfRegistration: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false })
  resetLink: string;

  @Prop({ type: [String], required: true })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
