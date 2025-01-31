import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService<FileStoreResult, FileDeleteResult> {
  abstract store(
    file: Buffer,
    path: string,
    config?: any,
    options?: {
      pathWithoutBucket?: boolean;
    },
  ): Promise<FileStoreResult>;

  abstract storeBase64(
    base64: string,
    path: string,
    config?: any,
  ): Promise<FileStoreResult>;

  abstract delete(path: string): Promise<FileDeleteResult>;
}
