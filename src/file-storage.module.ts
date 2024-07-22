import { Module } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { S3 } from "aws-sdk";
import { S3FileStorageService } from "./providers/aws/s3-file-storage.service";
import { FileStorageType } from "./enum/file-storage-type.enum";


@Module({
    imports: [],
    providers: [
        {
            provide: "S3FileStorageConfig",
            useFactory: (configService: ConfigService) => configService.get("aws"),
            inject: [ConfigService],
        },
        S3FileStorageService,
        {
            provide: 'S3',
            useFactory: () => {
                return new S3({
                    accessKeyId: '',
                    secretAccessKey: '',
                });
            }
        },
        {
            provide: "FileStorageService",
            useFactory: (
                s3FileStorageService: S3FileStorageService,
                configService: ConfigService,
            ) => {
                const fileStorageType = configService.get("fileStorageType");

                switch (fileStorageType) {
                    case FileStorageType.S3:
                        return s3FileStorageService;
                    default:
                        throw new Error("Wrong Storage Type");
                }
            },
            inject: [S3FileStorageService, ConfigService],
        },
    ],
    exports: ['FileStorageService'],
})
export class FileStorageModule {}