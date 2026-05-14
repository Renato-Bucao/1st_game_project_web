import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Email should not be empty' })
  email!: string;
}
