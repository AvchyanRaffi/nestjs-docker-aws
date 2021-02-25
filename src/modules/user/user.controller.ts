import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleTypeEnum } from '../../common/constants';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { ApiFile } from '../../decorators/swagger-schema';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { IFile } from '../../interfaces/IFile';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UserController {
  constructor(private _userService: UserService) {}

  @Put('password')
  @Roles(RoleTypeEnum.USER)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ChangePasswordDto,
    @AuthUser() doctor: UserEntity,
  ): Promise<void> {
    await this._userService.updatePassword(doctor, dto);
  }

  @Put(':userId')
  @Roles(RoleTypeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UserDto,
    description: 'Updates users info',
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile([{ name: 'avatar' }])
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Body() updateUserBaseDto: UpdateUserDto,
    @Param('userId') userId: string,
    @UploadedFile() avatar: IFile,
  ): Promise<UserDto> {
    const userEntity = await this._userService.updateUser(
      updateUserBaseDto,
      userId,
      avatar,
    );

    return userEntity.toUserDto();
  }
}
