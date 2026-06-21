import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string; // ✅ optional update for username

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password?: string; // ✅ optional update, will be re-hashed in service

  @IsOptional()
  @IsEmail()
  email?: string; // ✅ optional update for email

  @IsOptional()
  @Matches(/^(active|banned|suspended(?::(1day|3days|5days))?)$/)
  status?: string; // ✅ enforce allowed status values

  @IsOptional()
  @Matches(/^(user|moderator|admin)$/)
  role?: string; // ✅ enforce allowed roles

  @IsOptional()
  lastLogin?: Date; // ✅ optional update for last login

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  resetToken?: string;
}
