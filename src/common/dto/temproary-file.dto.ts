import { AbstractFileDto } from './abstract-file.dto';

export class TemporaryFileDto extends AbstractFileDto {
  constructor(fileEntity: any) {
    super(fileEntity);
    this.key = fileEntity.key;
  }
}
