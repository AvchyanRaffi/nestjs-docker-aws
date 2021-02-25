import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

import { RoleTypeEnum } from '../../../common/constants/role-type.enum';
import { ToLowerCase } from '../../../decorators/transforms.decorator';

export class UserLoginDto {
  @IsString()
  @ToLowerCase()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly type: RoleTypeEnum;
}
