import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsNumber, 
  IsIn, 
  IsDecimal, 
  IsNotEmpty 
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty() // prevent empty string if username is provided
  @IsOptional() // optional for update
  username?: string;

  @IsEmail()
  @IsOptional() // optional for update
  email?: string;

  @IsString()
  @IsOptional() // hashed password
  passwordHash?: string;

  @IsOptional()
  registrationDate?: Date;

  @IsOptional()
  lastLogin?: Date;

  @IsOptional()
  ipAddress?: string;

  @IsIn(['active', 'banned', 'suspended'])
  @IsOptional()
  accountStatus?: string;

  @IsIn(['player', 'moderator', 'admin'])
  @IsOptional()
  role?: string;

  @IsNumber()
  @IsOptional()
  vipLevel?: number;

  @IsNumber()
  @IsOptional()
  currencyBalance?: number;
}
