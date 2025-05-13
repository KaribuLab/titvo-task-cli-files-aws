import { Module } from '@nestjs/common'
import { createApiKeyRepository } from '@infrastructure/api-key/api-key.dynamo'
import { ApiKeyRepository, ValidateApiKeyUseCase } from '@titvo/auth'
import { CryptoModule } from '@infrastructure/crypto/crypto.module'
@Module({
  providers: [
    ValidateApiKeyUseCase,
    {
      provide: ApiKeyRepository,
      useFactory: () => {
        return createApiKeyRepository({
          tableName: process.env.API_KEY_TABLE_NAME as string,
          awsStage: process.env.AWS_STAGE as string,
          awsEndpoint: process.env.AWS_ENDPOINT as string
        })
      }
    }
  ],
  imports: [CryptoModule],
  exports: [ValidateApiKeyUseCase]
})
export class ApiKeyModule {}
