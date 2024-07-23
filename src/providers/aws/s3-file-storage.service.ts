import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileStorageService } from '../../.';
import { S3FileStorageConfig } from '.';

@Injectable()
export class S3FileStorageService extends FileStorageService<
  S3.ManagedUpload.SendData,
  S3.DeleteObjectOutput
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
  ): Promise<S3.ManagedUpload.SendData> {
    const uploadResult = this.s3
      .upload({
        Bucket: this.s3FileStorageConfig.bucket,
        Body: file,
        Key: `${path}`,
        ...config,
      })
      .promise();

    return uploadResult;
  }

  async delete(path: string): Promise<S3.DeleteObjectOutput> {
    const deletedFile = await this.s3
      .deleteObject({
        Bucket: this.s3FileStorageConfig.bucket,
        Key: path,
      })
      .promise();

    return deletedFile;
  }
}