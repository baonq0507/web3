import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: '2FA code (if enabled)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  twoFactorCode?: string;

  @ApiProperty({
    description: 'Client IP address for security logging',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientIp?: string;
}
