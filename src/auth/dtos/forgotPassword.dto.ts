import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  email: string;
}
