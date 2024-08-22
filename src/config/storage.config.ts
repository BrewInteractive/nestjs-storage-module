export const storageConfig = () => ({
  storageService: process.env.STORAGE_SERVICE,
  s3: {
    endpoint: process.env.S3_SERVICE_ENDPOINT,
    accessKey: process.env.S3_SERVICE_ACCESS_KEY,
    secretKey: process.env.S3_SERVICE_SECRET_KEY,
    region: process.env.S3_SERVICE_REGION,
    bucket: process.env.S3_SERVICE_BUCKET,
  },
});
