import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsIn(['DIYETISYEN', 'DANISAN', 'ADMIN'])
  role: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}