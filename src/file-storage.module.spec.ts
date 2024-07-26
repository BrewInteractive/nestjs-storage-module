import { ConfigModule } from '@nestjs/config';
import { FileStorageModule } from './file-storage.module';
import { FileStorageType } from './enum/file-storage-type.enum';
import { Test } from '@nestjs/testing';
import { storageConfig } from './config';

describe('FileStorageModule', () => {
  let fileStorageModule: FileStorageModule;

  it('Should be defined with mock configuration', async () => {
    const mockS3Config = () => ({
      aws: {
        accessKeyId: 'mock-access-key',
        secretAccessKey: 'mock-secret-key',
      },
      storageService: FileStorageType.S3,
    });

    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [mockS3Config],
        }),
        FileStorageModule,
      ],
    }).compile();

    fileStorageModule = app.get<FileStorageModule>(FileStorageModule);
    expect(fileStorageModule).toBeDefined();
  });

  it('Should be defined with env configuration', async () => {
    process.env.STORAGE_SERVICE = FileStorageType.S3;
    process.env.S3_SERVICE_ACCESS_KEY = 'test-access-key';
    process.env.S3_SERVICE_SECRET_KEY = 'test-secret-key';
    process.env.S3_SERVICE_REGION = 'test-region';
    process.env.S3_SERVICE_AWS_BUCKET = 'test-bucket';

    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [storageConfig],
        }),
        FileStorageModule,
      ],
    }).compile();

    fileStorageModule = app.get<FileStorageModule>(FileStorageModule);
    expect(fileStorageModule).toBeDefined();
  });

  it('Should throw error with invalid storage service', async () => {
    process.env.STORAGE_SERVICE = 'invalid-type';
    process.env.S3_SERVICE_ACCESS_KEY = 'test-access-key';
    process.env.S3_SERVICE_SECRET_KEY = 'test-secret-key';
    process.env.S3_SERVICE_REGION = 'test-region';
    process.env.S3_SERVICE_AWS_BUCKET = 'test-bucket';

    const expectedError = new Error('Wrong Storage Type');

    await expect(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [storageConfig],
          }),
          FileStorageModule,
        ],
      }).compile(),
    ).rejects.toThrow(expectedError);
  });
});
