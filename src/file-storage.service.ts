import { Injectable } from '@nestjs/common';
import { FileStorageType } from './enum/file-storage-type.enum';

@Injectable()
export abstract class FileStorageService {
    abstract store(file: Buffer, path: string);
    abstract delete(path: string);
}