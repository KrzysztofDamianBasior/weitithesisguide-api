import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(0, 1000)
  content: string;
}
