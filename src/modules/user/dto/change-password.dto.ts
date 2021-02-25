import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
