import { Module } from '@nestjs/common'
import { StorageModule } from '@infrastructure/storage/storage.module'
import { createDynamoCliFilesRepository } from '@infrastructure/cli-files/cli-files.dynamo'
import { CliFilesRepository } from '@titvo/trigger'
import { GetCliFilesSignedUrlsUseCase } from '@trigger/app/cli-files/cli-files.service'
import { ApiKeyModule } from '@infrastructure/api-key/api-key.module'
import { CryptoModule } from '@infrastructure/crypto/crypto.module'
@Module({
  providers: [
    GetCliFilesSignedUrlsUseCase,
    {
      provide: CliFilesRepository,
      useFactory: () => {
        return createDynamoCliFilesRepository(
          {
            tableName: process.env.TASK_CLI_FILES_TABLE_NAME as string,
            awsStage: process.env.AWS_STAGE as string,
            awsEndpoint: process.env.AWS_ENDPOINT as string
          }
        )
      }
    }
  ],
  imports: [StorageModule, ApiKeyModule, CryptoModule],
  exports: [GetCliFilesSignedUrlsUseCase]
})
export class CliFilesModule {}
