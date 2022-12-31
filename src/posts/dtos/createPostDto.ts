import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(0, 500)
  question: string;
}
