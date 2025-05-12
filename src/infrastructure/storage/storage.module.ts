import { Module } from '@nestjs/common'
import { S3Module } from '@titvo/aws'
import { StorageService } from '@titvo/shared'
import { S3StorageService } from '@infrastructure/storage/storage.s3'

@Module({
  providers: [
    {
      provide: StorageService,
      useClass: S3StorageService
    }
  ],
  imports: [S3Module],
  exports: [StorageService]
})
export class StorageModule {}
