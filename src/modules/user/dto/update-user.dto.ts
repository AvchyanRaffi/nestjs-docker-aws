import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

import { ToDate, ToLowerCase } from '../../../decorators/transforms.decorator';
import { IsPhoneNumber } from '../../../decorators/validators.decorator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @ToLowerCase()
  @ApiPropertyOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @ToDate('DD.MM.YYYY')
  birthDate: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly password: string;
}
