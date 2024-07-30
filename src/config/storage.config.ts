export const storageConfig = () => ({
  storageService: process.env.STORAGE_SERVICE,
  aws: {
    accessKeyId: process.env.S3_SERVICE_ACCESS_KEY,
    secretAccessKey: process.env.S3_SERVICE_SECRET_KEY,
    region: process.env.S3_SERVICE_REGION,
    bucket: process.env.S3_SERVICE_AWS_BUCKET,
  },
});
