import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService {
    abstract store(file: Buffer, path: string);
    abstract delete(path: string);
}