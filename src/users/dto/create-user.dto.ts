import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsIn, 
  IsOptional
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

    // ✅ optional, auto‑set from req.ip
  @IsString()
  @IsOptional()
  ipAddress?: string;
}