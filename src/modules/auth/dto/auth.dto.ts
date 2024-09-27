import { MAXIMUM_PASSWORD, MINIMUM_PASSWORD } from '@/consts/password-salt';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(MINIMUM_PASSWORD)
  @MaxLength(MAXIMUM_PASSWORD)
  password: string;
}
