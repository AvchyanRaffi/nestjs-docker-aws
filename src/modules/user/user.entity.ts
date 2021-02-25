import { Column, Entity, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleTypeEnum } from '../../common/constants';
import { UtilsService } from '../../providers/utils.service';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'users' })
@Unique(['email', 'role'])
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text' })
  role: RoleTypeEnum;

  @Column({ type: 'timestamp without time zone', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  get fullName(): string {
    return this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName;
  }

  is(...roles: RoleTypeEnum[]): boolean {
    return roles.includes(this.role);
  }

  toUserDto(): UserDto {
    return this._toDto<UserDto>(UserDto);
  }

  private _toDto<T>(dtoClass: new (entity: UserEntity) => T, options?: any): T {
    return UtilsService.toDto(dtoClass, this, options);
  }

  toDto(): UserDto {
    switch (this.role) {
      case RoleTypeEnum.USER:
        return this.toUserDto();
    }
  }

  dtoClass = UserDto;
}
