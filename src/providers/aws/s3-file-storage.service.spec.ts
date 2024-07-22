import { Test, TestingModule } from '@nestjs/testing';
import { S3FileStorageService } from './s3-file-storage.service';
import { S3 } from 'aws-sdk';

const mockS3FileStorageConfig = {
  s3ServiceBucket: 'mock-bucket',
};

const mockS3Upload = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({ Location: 'mock-location' }),
});

const mockS3DeleteObject = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({}),
});

const mockS3Client = {
  upload: mockS3Upload,
  deleteObject: mockS3DeleteObject,
};

describe('S3FileStorageService', () => {
  let s3FileStorageService: S3FileStorageService;
  let s3: S3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3FileStorageService,
        {
          provide: 'S3FileStorageConfig',
          useValue: mockS3FileStorageConfig,
        },
        {
          provide: 'S3',
          useValue: mockS3Client as any, // Use 'as any' to avoid type check error
        },
      ],
    }).compile();

    s3FileStorageService = module.get<S3FileStorageService>(S3FileStorageService);
    s3 = module.get<S3>('S3');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(s3FileStorageService).toBeDefined();
  });

  describe('store method', () => {
    it('should upload file to S3', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';

      await s3FileStorageService.store(fileBuffer, filePath);

      expect(mockS3Upload).toHaveBeenCalledWith({
        Bucket: mockS3FileStorageConfig.s3ServiceBucket,
        Body: fileBuffer,
        Key: filePath,
        ACL: 'public-read',
        ContentDisposition: 'inline',
      });
    });

    it('should handle errors during upload', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';

      mockS3Upload.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('Upload failed')),
      });

      await expect(s3FileStorageService.store(fileBuffer, filePath)).rejects.toThrow('Upload failed');
    });
  });

  describe('delete method', () => {
    it('should delete file from S3', async () => {
      const filePath = 'test-file.txt';

      await s3FileStorageService.delete(filePath);

      expect(mockS3DeleteObject).toHaveBeenCalledWith({
        Bucket: mockS3FileStorageConfig.s3ServiceBucket,
        Key: filePath,
      });
    });

    it('should handle errors during deletion', async () => {
      const filePath = 'test-file.txt';

      mockS3DeleteObject.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('Deletion failed')),
      });

    
      await expect(s3FileStorageService.delete(filePath)).rejects.toThrow('Deletion failed');
    });
  });
});
