import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UpdateEmailDto {
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;
}
