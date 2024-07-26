import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileStorageType } from './enum/file-storage-type.enum';
import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3FileStorageService } from './providers/aws/s3-file-storage.service';
import { storageConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [storageConfig],
    }),
  ],
  providers: [
    {
      provide: 'S3FileStorageConfig',
      useFactory: (configService: ConfigService) => configService.get('aws'),
      inject: [ConfigService],
    },
    S3FileStorageService,
    {
      provide: 'S3',
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get('aws');
        return new S3({
          accessKeyId: s3Config.accessKey,
          secretAccessKey: s3Config.secretKey,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'FileStorageService',
      useFactory: (
        s3FileStorageService: S3FileStorageService,
        configService: ConfigService,
      ) => {
        const fileStorageType = configService.get('storageService');
        switch (fileStorageType) {
          case FileStorageType.S3:
            return s3FileStorageService;
          default:
            throw new Error('Wrong Storage Type');
        }
      },
      inject: [S3FileStorageService, ConfigService],
    },
  ],
  exports: ['FileStorageService'],
})
export class FileStorageModule {}
