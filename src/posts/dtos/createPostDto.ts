import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(0, 1000)
  content: string;
}
