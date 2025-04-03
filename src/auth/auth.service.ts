import { Injectable, Logger } from '@nestjs/common'
import { ApiKeyNotFoundError, NoAuthorizedApiKeyError } from './auth.error'
import { ApiKeyRepository } from '../api-key/api-key.repository'
import { createHash } from 'crypto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor (
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async validateApiKey (apiKey: string | undefined): Promise<void> {
    if (apiKey === undefined) {
      throw new ApiKeyNotFoundError('API key not found')
    }

    // Hash the API key with SHA-256
    const hashedApiKey = createHash('sha256').update(apiKey).digest('hex')

    this.logger.debug(`Hashed API key: ${hashedApiKey}`)

    // Find the API key in the repository
    const apiKeyRecord = await this.apiKeyRepository.findByApiKey(hashedApiKey)

    if (apiKeyRecord === null) {
      throw new NoAuthorizedApiKeyError('API key is not authorized')
    }
  }
}
