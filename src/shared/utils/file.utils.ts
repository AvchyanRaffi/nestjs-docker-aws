export class FileUtils {
  static getS3PublicUrl(key: string): string {
    if (!key) {
      return null;
    }
    return `https://s3.eu-central-1.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${key}`;
  }
}
