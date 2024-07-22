import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { FileStorageModule } from './file-storage.module';
import { FileStorageType } from './enum/file-storage-type.enum';

describe('FileStorageModule', () => {
  let fileStorageModule: FileStorageModule;

  it('Should be defined with valid configuration', async () => {
    const mockS3Config = () => ({
      aws: {
        accessKeyId: 'mock-access-key',
        secretAccessKey: 'mock-secret-key',
      },
      fileStorageType: FileStorageType.S3,
    });

    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
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
});
