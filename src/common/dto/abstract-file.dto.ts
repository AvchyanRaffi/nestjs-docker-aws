import { FileUtils } from '../../shared/utils/file.utils';
import { AbstractDto } from './abstract.dto';

export class AbstractFileDto extends AbstractDto {
  size: number;
  key: string;
  originalName: string;

  constructor(fileEntity: any) {
    super(fileEntity);
    this.size = fileEntity.size;
    this.key = FileUtils.getS3PublicUrl(fileEntity.key);
    this.originalName = fileEntity.originalName;
  }
}
