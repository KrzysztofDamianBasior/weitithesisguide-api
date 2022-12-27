import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(2, 20)
  username: string;

  @IsString()
  @Length(2, 30)
  password: string;
}
