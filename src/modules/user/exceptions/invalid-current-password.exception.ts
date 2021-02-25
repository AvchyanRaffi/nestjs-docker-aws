import { BadRequestException } from '@nestjs/common';

export class InvalidCurrentPasswordException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalid_current_password', error);
  }
}
