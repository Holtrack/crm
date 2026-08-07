import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@holtrack.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'holtrack2026' })
  @IsString()
  @MinLength(1)
  password: string;
}
