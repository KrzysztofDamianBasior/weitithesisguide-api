import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 20)
  @IsOptional()
  username?: string;

  @IsString()
  @MaxLength(40)
  @IsEmail()
  @IsOptional()
  email?: string;
}
