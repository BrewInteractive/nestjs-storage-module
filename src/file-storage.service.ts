import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService<StoreResult, DeleteResult> {
  abstract store(
    file: Buffer,
    path: string,
    config?: any,
  ): Promise<StoreResult>;
  abstract delete(path: string): Promise<DeleteResult>;
}
