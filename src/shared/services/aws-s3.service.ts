import { BadRequestException, Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import mime from 'mime-types';
import path from 'path';

import { IAwsFile } from '../../interfaces/aws-file.interface';
import { IFile } from '../../interfaces/IFile';
import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';

@Injectable()
export class AwsS3Service {
  private readonly _s3: AWS.S3;

  constructor(
    public configService: ConfigService,
    public generatorService: GeneratorService,
  ) {
    const options: AWS.S3.Types.ClientConfiguration = {
      apiVersion: '2012-10-17',
    };

    const awsS3Config = configService.awsS3Config;
    if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
      options.credentials = awsS3Config;
    }

    this._s3 = new AWS.S3(options);
  }

  async uploadFile(file: IFile, filePath: string): Promise<string> {
    const fileName = this.generatorService.fileName(
      <string>mime.extension(file.mimetype) === 'heic'
        ? 'jpeg'
        : <string>mime.extension(file.mimetype),
    );
    return this._uploadFile({
      name: fileName,
      path: filePath,
      buffer: file.buffer,
      size: file.size,
      originalName: file?.originalname,
    });
  }

  async uploadFileBuffer(
    buffer: Buffer,
    mimetype: string,
    filePath: string,
  ): Promise<string> {
    const fileName = this.generatorService.fileName(
      <string>mime.extension(mimetype),
    );
    return this._uploadFile({
      buffer,
      name: fileName,
      path: filePath,
      size: buffer.length,
    });
  }

  async deleteFile(file: string, filePath: string): Promise<void> {
    await this._s3
      .deleteObject({
        Bucket: this.configService.awsS3Config.bucketName,
        Key: filePath + file,
      })
      .promise();
  }

  putObject(params: {
    key: string;
    buffer: Buffer;
    ACL?: AWS.S3.ObjectCannedACL;
    metadata?: AWS.S3.Metadata;
  }) {
    return this._s3
      .putObject({
        ACL: params.ACL || 'public-read',
        Bucket: this.configService.awsS3Config.bucketName,
        Body: params.buffer,
        Key: params.key,
        Metadata: params.metadata,
      })
      .promise();
  }

  async uploadLicenseFile(file: IFile, doctorId: string): Promise<string> {
    return this.uploadFile(file, `doctor-license/${doctorId}`);
  }

  async moveFile(params: {
    to: string;
    key: string;
    ACL?: AWS.S3.ObjectCannedACL;
  }) {
    const bucketName = this.configService.awsS3Config.bucketName;
    const key = `${params.to}/${path.basename(params.key)}`;

    await this._s3
      .copyObject({
        ACL: params.ACL || 'public-read',
        Bucket: this.configService.awsS3Config.bucketName,
        CopySource: `${bucketName}/${params.key}`,
        Key: key,
      })
      .promise();

    const headObject = await this.getFileInfo({ key, bucketName });

    return {
      key,
      originalName: headObject.Metadata.originalname,
      size: Number(headObject.Metadata.size),
    };
  }

  async getFileInfo(options: { key: string; bucketName: string }) {
    try {
      const headParams = {
        Bucket: options.bucketName,
        Key: options.key,
      };

      return this._s3.headObject(headParams).promise();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async _uploadFile(file: IAwsFile): Promise<string> {
    const key = path.join(file.path, file.name);
    await this._s3
      .putObject({
        Bucket: this.configService.awsS3Config.bucketName,
        Body: file.buffer,
        ACL: 'public-read',
        Key: key,
        Metadata: {
          originalName: file?.originalName || file?.name,
          size: file.size.toString(),
        },
      })
      .promise();

    return key;
  }
}
