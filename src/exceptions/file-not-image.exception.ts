import { BadRequestException } from '@nestjs/common';

export class FileNotImageException extends BadRequestException {
  constructor() {
    super('error.file.not_image');
  }
}
