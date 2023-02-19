import { IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @Length(0, 10000)
  content: string;

  @IsString()
  @Length(0, 200)
  title: string;
}
