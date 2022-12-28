import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateMyAccountDto {
  @IsString()
  @Length(3, 20)
  @IsOptional()
  username: string;

  @IsString()
  @Length(5, 30)
  @IsOptional()
  password: string;

  @IsString()
  @MaxLength(40)
  @IsEmail()
  @IsOptional()
  email?: string;
}
