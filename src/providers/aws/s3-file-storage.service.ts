import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileStorageService } from '../../file-storage.service';
import { S3FileStorageConfig } from '.';
import { FileDeleteResult, FileStoreResult } from '../../dto';

@Injectable()
export class S3FileStorageService extends FileStorageService<
  FileStoreResult,
  FileDeleteResult
> {
  constructor(
    @Inject('S3FileStorageConfig')
    private readonly s3FileStorageConfig: S3FileStorageConfig,
    @Inject('S3')
    private readonly s3: S3,
  ) {
    super();
  }
  async store(
    file: Buffer,
    path: string,
    config?: any,
  ): Promise<FileStoreResult> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.s3FileStorageConfig.bucket,
        Body: file,
        Key: `${path}`,
        ...config,
      })
      .promise();

    return {
      response: uploadResult,
      fileName: uploadResult.Key,
      path: uploadResult.Location,
    } as FileStoreResult;
  }

  async delete(path: string): Promise<FileDeleteResult> {
    const deletedFile = this.s3
      .deleteObject({
        Bucket: this.s3FileStorageConfig.bucket,
        Key: path,
      })
      .promise();

    return { response: deletedFile } as FileDeleteResult;
  }
}
