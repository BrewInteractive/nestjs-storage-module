export const storageConfig = () => ({
    storageService: process.env.STORAGE_SERVICE,
    aws: {
      s3ServiceAccessKey: process.env.S3_SERVICE_ACCESS_KEY,
      s3ServiceSecretKey: process.env.S3_SERVICE_SECRET_KEY,
      s3ServiceRegion: process.env.S3_SERVICE_REGION,
      s3ServiceAwsBucket: process.env.S3_SERVICE_AWS_BUCKET,
    },
  });
  