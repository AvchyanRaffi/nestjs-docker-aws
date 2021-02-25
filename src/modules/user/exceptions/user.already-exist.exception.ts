import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor() {
    super('error.user_already_exist');
  }
}
