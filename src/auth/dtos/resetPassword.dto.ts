import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @MaxLength(2048)
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @Length(5, 30)
  password: string;
}
