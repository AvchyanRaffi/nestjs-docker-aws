import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RoleTypeEnum } from '../../../common/constants/role-type.enum';
import { FileUtils } from '../../../shared/utils/file.utils';
import { UserEntity } from '../user.entity';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiPropertyOptional({ enum: RoleTypeEnum })
  role: RoleTypeEnum;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  birthDate: Date;

  @ApiPropertyOptional()
  avatar: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.createdAt = userEntity.createdAt;
    this.updatedAt = userEntity.updatedAt;
    this.firstName = userEntity.firstName;
    this.lastName = userEntity.lastName;
    this.role = userEntity.role;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.birthDate = userEntity.birthDate;
    this.avatar = FileUtils.getS3PublicUrl(userEntity.avatar);
  }
}
