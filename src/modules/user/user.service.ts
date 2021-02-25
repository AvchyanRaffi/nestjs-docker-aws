import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { FindConditions } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { RoleTypeEnum } from '../../common/constants';
import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { UtilsService } from '../../providers/utils.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { FileService } from '../../shared/services/file.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { InvalidCurrentPasswordException } from './exceptions/invalid-current-password.exception';
import { PasswordNotValidException } from './exceptions/password-not-valid.excetion';
import { UserNotFoundException } from './exceptions/user-not-fount.exception';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly fileService: FileService,
    public readonly awsS3Service: AwsS3Service,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(findData);
  }

  async findUsersByIds(userIds: string[]): Promise<UserEntity[]> {
    if (_.isEmpty(userIds)) {
      return [];
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id in (:...userIds)', { userIds });

    return queryBuilder.getMany();
  }

  async findUserById(userId: string): Promise<UserEntity> {
    const users = await this.findUsersByIds([userId]);
    return users[0];
  }

  @Transactional()
  createUser(
    userRegisterDto: UserRegisterDto,
    options: { role: RoleTypeEnum },
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...userRegisterDto,
      role: options.role,
    });

    return this.userRepository.save(user);
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: string,
    avatar?: IFile,
  ): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({
      id: userId,
      role: RoleTypeEnum.USER,
    });

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    if (
      (updateUserDto.email && updateUserDto.email !== userEntity.email) ||
      (updateUserDto.phone && updateUserDto.phone !== userEntity.phone)
    ) {
      const isPasswordValid = await UtilsService.validateHash(
        updateUserDto.password,
        userEntity?.password,
      );

      if (!isPasswordValid) {
        throw new PasswordNotValidException();
      }
    }

    let avatarKey = userEntity.avatar;

    if (avatar) {
      if (!this.fileService.isAvatar(avatar.mimetype)) {
        throw new FileNotImageException();
      }

      avatarKey = await this.awsS3Service.uploadFile(avatar, 'users/avatars/');
    }

    this.userRepository.merge(userEntity, {
      ..._.omit(updateUserDto, 'password'),
      avatar: avatarKey,
    });

    return this.userRepository.save(userEntity);
  }

  async updatePassword(
    userEntity: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const isPasswordValid = await UtilsService.validateHash(
      changePasswordDto.password,
      userEntity.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCurrentPasswordException();
    }

    userEntity.password = changePasswordDto.newPassword;

    await this.userRepository.save(userEntity);
  }
}
