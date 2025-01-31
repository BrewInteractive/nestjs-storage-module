import { Test, TestingModule } from '@nestjs/testing';
import { S3FileStorageService } from './s3-file-storage.service';

const mockS3FileStorageConfig = {
  bucket: 'mock-bucket',
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
          useValue: mockS3Client as any,
        },
      ],
    }).compile();

    s3FileStorageService =
      module.get<S3FileStorageService>(S3FileStorageService);
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
        Bucket: mockS3FileStorageConfig.bucket,
        Body: fileBuffer,
        Key: filePath,
      });
    });

    it('should handle errors during upload', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';

      jest
        .spyOn(s3FileStorageService, 'store')
        .mockRejectedValueOnce(new Error('Upload failed'));

      await expect(
        s3FileStorageService.store(fileBuffer, filePath),
      ).rejects.toThrow('Upload failed');
    });

    it('should return path with bucket when pathWithoutBucket option is false', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';
      const mockLocation = 'mock-location';

      mockS3Upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ 
          Location: mockLocation,
          Key: filePath 
        }),
      });

      const result = await s3FileStorageService.store(fileBuffer, filePath, {}, { pathWithoutBucket: false });

      expect(result.path).toBe(`${mockS3FileStorageConfig.bucket}/${filePath}`);
    });

    it('should return path without bucket when pathWithoutBucket option is true', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';
      const mockLocation = 'mock-location';

      mockS3Upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ 
          Location: mockLocation,
          Key: filePath 
        }),
      });

      const result = await s3FileStorageService.store(fileBuffer, filePath, {}, { pathWithoutBucket: true });

      expect(result.path).toBe(filePath);
    });

    it('should return path with bucket when no options provided', async () => {
      const fileBuffer = Buffer.from('mock-file-content');
      const filePath = 'test-file.txt';
      const mockLocation = 'mock-location';

      mockS3Upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ 
          Location: mockLocation,
          Key: filePath 
        }),
      });

      const result = await s3FileStorageService.store(fileBuffer, filePath);

      expect(result.path).toBe(`${mockS3FileStorageConfig.bucket}/${filePath}`);
    });
  });

  describe('delete method', () => {
    it('should delete file from S3', async () => {
      const filePath = 'test-file.txt';

      await s3FileStorageService.delete(filePath);

      expect(mockS3DeleteObject).toHaveBeenCalledWith({
        Bucket: mockS3FileStorageConfig.bucket,
        Key: filePath,
      });
    });

    it('should handle errors during deletion', async () => {
      const filePath = 'test-file.txt';

      jest
        .spyOn(s3FileStorageService, 'delete')
        .mockRejectedValueOnce(new Error('Deletion failed'));

      await expect(s3FileStorageService.delete(filePath)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });

  describe('store method', () => {
    it('should upload file to S3', async () => {
      const base64String = 'iVBORw0KGgoAAAANSUhEUgAA';
      const fileBuffer = Buffer.from(base64String, 'base64');
      const filePath = 'test-file.txt';

      await s3FileStorageService.storeBase64(base64String, filePath);

      expect(mockS3Upload).toHaveBeenCalledWith({
        Bucket: mockS3FileStorageConfig.bucket,
        Body: fileBuffer,
        Key: filePath,
      });
    });

    it('should handle errors during upload', async () => {
      const base64String = 'iVBORw0KGgoAAAANSUhEUgAA';
      const filePath = 'test-file.txt';

      jest
        .spyOn(s3FileStorageService, 'store')
        .mockRejectedValueOnce(new Error('Upload failed'));

      await expect(
        s3FileStorageService.storeBase64(base64String, filePath),
      ).rejects.toThrow('Upload failed');
    });
  });
});
