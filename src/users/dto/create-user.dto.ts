import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString() // ✅ ensure string type
  @IsNotEmpty() // ✅ cannot be empty
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // ✅ enforce minimum length
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  }) // ✅ enforce complexity
  password!: string;

  @IsEmail() // ✅ must be valid email format
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  status?: string; // ✅ add this

  @IsOptional()
  @IsString()
  ipAddress?: string; // ✅ add this
}
