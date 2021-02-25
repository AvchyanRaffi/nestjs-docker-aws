import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { RoleTypeEnum } from '../../common/constants';
import { ContextService } from '../../providers/context.service';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { UserRegisterDto } from '../user/dto/user-register.dto';
import { InvalidCurrentPasswordException } from '../user/exceptions/invalid-current-password.exception';
import { UserAlreadyExistException } from '../user/exceptions/user.already-exist.exception';
import { UserNotFoundException } from '../user/exceptions/user-not-fount.exception';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  private static _authUserKey = 'user_key';

  constructor(
    public readonly userService: UserService,
    public readonly configService: ConfigService,
    public readonly jwtService: JwtService,
  ) {}

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    options: { role: RoleTypeEnum },
  ): Promise<UserEntity> {
    let userEntity: UserEntity;

    userEntity = await this.userService.findOne({
      email: userRegisterDto.email,
      role: RoleTypeEnum.USER,
    });

    if (userEntity) {
      throw new UserAlreadyExistException();
    }
    userEntity = await this.userService.createUser(userRegisterDto, options);

    return userEntity;
  }

  async createToken(user: UserEntity): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.getNumber('TOKEN_EXPIRES_IN'),
      accessToken: await this.jwtService.signAsync({
        role: user.role,
        id: user.id,
      }),
    });
    // await this._memoryCacheService.setToken(
    //   token.accessToken,
    //   user.id,
    //   user.role,
    // );
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
      role: userLoginDto.type,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await UtilsService.validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCurrentPasswordException();
    }

    return user;
  }

  static setAuthUser(user: UserEntity): void {
    ContextService.set(AuthService._authUserKey, user);
  }
}
