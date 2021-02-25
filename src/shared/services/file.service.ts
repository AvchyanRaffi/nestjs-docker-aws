import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import _ from 'lodash';
import mime from 'mime-types';
import path from 'path';
import querystring from 'querystring';
import uuid from 'uuid';

import { TemporaryFileDto } from '../../common/dto/temproary-file.dto';
import { FileNotValidTypeException } from '../../exceptions/file-not-valid.exception';
import { IFile } from '../../interfaces/IFile';
import { AwsS3Service } from './aws-s3.service';

@Injectable()
export class FileService {
  constructor(private readonly _awsS3Service: AwsS3Service) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private async _uploadFiles(
    files: IFile[],
    options: { to: string; ACL?: S3.ObjectCannedACL },
  ) {
    const fileKeys: string[] = [];
    const putObjectPromises: Promise<any>[] = [];
    for (const file of files) {
      const originalName = querystring.escape(file.originalname);
      const extension = path.extname(file.originalname);
      const fileKey = `${options.to}/${uuid.v1()}${extension}`;
      fileKeys.push(fileKey);
      putObjectPromises.push(
        this._awsS3Service.putObject({
          key: fileKey,
          buffer: file.buffer,
          ACL: options.ACL,
          metadata: { originalName, size: file.size.toString() },
        }),
      );
    }

    await Promise.all(putObjectPromises);

    return fileKeys;
  }

  async uploadTemporary(
    file: IFile,
  ): Promise<{
    key: string;
    originalName: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException();
    }

    if (
      !this.isExcel(file.mimetype) &&
      !this.isDocument(file.mimetype) &&
      !this.isMedia(file.mimetype) &&
      !this.isArchive(file.mimetype)
    ) {
      throw new FileNotValidTypeException();
    }

    file.originalname = querystring.escape(file.originalname);
    const key = await this._awsS3Service.uploadFile(file, 'tmp');

    return new TemporaryFileDto({
      key,
      originalName: file.originalname,
      size: file.size,
    });
  }

  moveFiles(params: { to: string; key: string; ACL?: S3.ObjectCannedACL }) {
    return this._awsS3Service.moveFile(params);
  }

  public isImage(mimeType: string): boolean {
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/tiff',
      'image/vnd.wap.wbmp',
      'image/x-icon',
      'image/x-jng',
      'image/x-ms-bmp',
      'image/svg+xml',
      'image/webp',
      'image/gif',
    ];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isAvatar(mimeType: string): boolean {
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/heic'];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isPdf(mimeType: string): boolean {
    const imageMimeTypes = ['application/pdf'];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isMedia(mimeType: string): boolean {
    return (
      this.isImage(mimeType) || this.isVideo(mimeType) || this.isAudio(mimeType)
    );
  }

  public isVideo(mimeType: string): boolean {
    const imageMimeTypes = [
      'video/mp4',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-ms-asf',
      'video/x-mng',
      'video/x-flv',
      'video/quicktime',
      'video/mpeg',
      'video/3gpp',
    ];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isAudio(mimeType: string): boolean {
    return mimeType === 'audio/mpeg';
  }

  public isExcel(mimeType: string): boolean {
    if (mimeType === 'application/octet-stream') {
      return true;
    }

    const extensionName = mime.extension(mimeType);
    const excelExtension = ['xlsx', 'xls'];
    return _.includes(excelExtension, extensionName);
  }

  public isDocument(mimeType: string): boolean {
    const extensionName = mime.extension(mimeType);
    const excelExtension = ['doc', 'docx', 'txt', 'pdf', 'xml', 'ppt', 'pptx'];
    return _.includes(excelExtension, extensionName);
  }

  public isArchive(mimeType: string): boolean {
    const extensionName = mime.extension(mimeType);
    const excelExtension = ['7z', 'rar', 'zip'];
    return _.includes(excelExtension, extensionName);
  }
}
