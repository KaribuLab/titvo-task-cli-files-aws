import { S3Service } from '@titvo/aws'
import { GetSignedUrlInput, GetSignedUrlOutput, StorageService } from '@titvo/shared'

export class S3StorageService extends StorageService {
  constructor (private readonly s3Service: S3Service) {
    super()
  }

  async getSignedUrl (input: GetSignedUrlInput): Promise<GetSignedUrlOutput> {
    return {
      url: await this.s3Service.getSignedUrl(input.containerName, input.filePath, input.contentType, input.expiresIn)
    }
  }
}
