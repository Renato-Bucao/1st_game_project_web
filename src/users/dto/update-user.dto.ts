import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsIn, 
  IsNotEmpty 
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string; // optional, but cannot be empty if provided

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string; // optional, will be re-hashed if updated

  @IsEmail()
  @IsOptional()
  email?: string; // optional, must be valid email if provided

  @IsIn(['active', 'banned', 'suspended'])
  @IsOptional()
  status?: string; // optional, must be one of these values

  @IsIn(['member', 'moderator', 'admin'])
  @IsOptional()
  role?: string; // optional, must be one of these values

  @IsOptional()
  lastLogin?: Date; // optional, updated automatically on login

  @IsString()
  @IsOptional()
  ipAddress?: string; // optional, updated when user logs in/registers
}
