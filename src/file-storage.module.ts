import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileStorageType } from './enum/file-storage-type.enum';
import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3FileStorageConfig } from './providers/s3';
import { S3FileStorageService } from './providers/s3/s3-file-storage.service';
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
      useFactory: (configService: ConfigService) => configService.get('s3'),
      inject: [ConfigService],
    },
    S3FileStorageService,
    {
      provide: 'S3',
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get('s3') as S3FileStorageConfig;
        return new S3({
          s3ForcePathStyle: true,
          sslEnabled: false,
          endpoint: s3Config.endpoint,
          region: s3Config.region,
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
