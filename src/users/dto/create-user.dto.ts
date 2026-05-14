import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsNumber, 
  IsIn, 
  IsDecimal 
} from 'class-validator';

export class CreateUserDto {
  @IsString() // username must be string
  username!: string;

  @IsEmail() // must be valid email format
  @IsOptional() // optional kung imong entity gi-set as nullable
  email?: string;

  @IsString() // password hash (hashed value, not plain text)
  passwordHash!: string;

  @IsOptional() // DB auto-sets registration date
  registrationDate?: Date;

  @IsOptional() // updated when user logs in
  lastLogin?: Date;

  @IsOptional() // last known IP address
  ipAddress?: string;

  @IsIn(['active', 'banned', 'suspended']) // must be one of these
  @IsOptional() // default is active
  accountStatus?: string;

  @IsIn(['player', 'moderator', 'admin']) // must be one of these roles
  @IsOptional() // default is player
  role?: string;

  @IsNumber() // VIP level must be number
  @IsOptional() // default is 0
  vipLevel?: number;

  @IsNumber()
  @IsOptional() // default is 0.00
  currencyBalance?: number;
}
