import { IsString, Length } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @Length(3, 20)
  username: string;
}
