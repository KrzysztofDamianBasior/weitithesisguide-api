import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(5, 50)
  password: string;
}
