import { BadRequestException } from '@nestjs/common';

export class PasswordNotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.password_not_valid', error);
  }
}
