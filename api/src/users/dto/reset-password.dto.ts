import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class AdminResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
  
  @IsString()
  @IsNotEmpty()
  reason?: string;
}
