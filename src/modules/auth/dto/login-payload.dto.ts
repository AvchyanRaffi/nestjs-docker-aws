import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dto/user.dto';
import { UserEntity } from '../../user/user.entity';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: UserEntity, token: TokenPayloadDto) {
    this.user = user.toDto();
    this.token = token;
  }
}
