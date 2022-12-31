import { IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @Length(0, 500)
  answer: string;

  @IsString()
  postId: string;
}
