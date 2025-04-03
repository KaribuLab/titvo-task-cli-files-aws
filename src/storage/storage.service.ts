import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Logger } from '@nestjs/common'

export interface StorageServiceOptions {
  awsStage: string
  awsEndpoint: string
}

export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  constructor (private readonly s3Client: S3Client) {}

  async getSignedUrl (bucket: string, key: string, contentType: string, expiresIn: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType
    })
    return await getSignedUrl(this.s3Client, command, {
      expiresIn
    })
  }
}
export function createStorageService (options: StorageServiceOptions): StorageService {
  const s3Client = options.awsStage === 'localstack'
    ? new S3Client({ endpoint: options.awsEndpoint })
    : new S3Client()

  return new StorageService(s3Client)
}
