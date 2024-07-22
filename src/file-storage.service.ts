import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService {
  abstract store(file: Buffer, path: string, config: any);
  abstract delete(path: string);
}
