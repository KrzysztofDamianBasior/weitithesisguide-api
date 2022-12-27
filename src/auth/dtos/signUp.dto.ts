import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  @Length(5, 30)
  password: string;

  @IsString()
  @MaxLength(40)
  @IsEmail()
  @IsOptional()
  email?: string;
}
