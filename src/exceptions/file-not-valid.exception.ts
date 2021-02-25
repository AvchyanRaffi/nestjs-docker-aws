import { BadRequestException } from '@nestjs/common';

export class FileNotValidTypeException extends BadRequestException {
  constructor() {
    super('error.file.not_valid_type');
  }
}
