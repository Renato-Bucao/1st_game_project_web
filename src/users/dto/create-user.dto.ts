import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsIn 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string; // required, unique username

  @IsString()
  @IsNotEmpty()
  password!: string; // required, hashed password

  @IsEmail()
  @IsNotEmpty()
  email!: string; // required, unique email

  @IsIn(['active', 'banned', 'suspended'])
  status!: string; // required, default 'active'

  @IsIn(['user', 'moderator', 'admin'])
  role!: string; // required, default 'user'

  @IsString()
  @IsNotEmpty()
  ipAddress!: string; // required, must log IP after registration
}