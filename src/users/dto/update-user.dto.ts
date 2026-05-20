import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsNotEmpty, 
  Matches 
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string; // will be re-hashed in service

  @IsEmail()
  @IsOptional()
  email?: string;

  // ✅ Allow "active", "banned", or "suspended:<duration>"
  @IsOptional()
  @Matches(/^(active|banned|suspended(?::(1day|3days|5days))?)$/)
  status?: string;

  @IsOptional()
  @Matches(/^(user|moderator|admin)$/)
  role?: string;

  @IsOptional()
  lastLogin?: Date;

  @IsOptional()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  resetToken?: string;
}
