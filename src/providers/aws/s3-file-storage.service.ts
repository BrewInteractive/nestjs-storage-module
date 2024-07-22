import { Inject, Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { FileStorageService } from "../../file-storage.service";
import { S3FileStorageConfig } from "./s3-file-storage.config";

@Injectable()
export class S3FileStorageService extends FileStorageService{
    constructor(
        @Inject("S3FileStorageConfig")
        private readonly s3FileStorageConfig: S3FileStorageConfig,
        @Inject('S3')
        private readonly s3: S3,
    ) {
        super();
    }

    async store(file: Buffer, path: string) {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.s3FileStorageConfig.bucket,
          Body: file,
          Key: `${path}`,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        })
        .promise();

      return uploadResult;
    }

    async delete(path: string) {
      const deletedFile = await this.s3
        .deleteObject({
          Bucket: this.s3FileStorageConfig.bucket,
          Key: path,
        })
        .promise();

      return deletedFile;
    }
}