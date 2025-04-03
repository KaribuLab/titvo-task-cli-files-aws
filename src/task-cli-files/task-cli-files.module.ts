import { Module } from '@nestjs/common'
import { TaskCliFilesService } from './task-cli-files.service'
import { LoggerModule } from 'nestjs-pino'
import { pino } from 'pino'
import { createTaskCliFilesRepository, TaskCliFilesRepository } from './task-cli-files.repository'
import { StorageService, createStorageService } from '../storage/storage.service'
import { ApiKeyRepository, createApiKeyRepository } from '../api-key/api-key.repository'
import { AuthService } from '../auth/auth.service'

const awsStage = process.env.AWS_STAGE ?? 'localstack'
const awsEndpoint = process.env.AWS_ENDPOINT ?? 'http://localhost:4566'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level (label: string): { level: string } {
            return { level: label }
          }
        }
      }
    })
  ],
  providers: [
    TaskCliFilesService, {
      useFactory: () => {
        return createTaskCliFilesRepository({
          tableName: `tvo-security-scan-task-cli-files-${awsStage}`,
          awsEndpoint,
          awsStage
        })
      },
      provide: TaskCliFilesRepository
    },
    {
      provide: StorageService,
      useFactory: () => {
        return createStorageService({ awsStage, awsEndpoint })
      }
    },
    AuthService,
    {
      provide: ApiKeyRepository,
      useFactory: () => {
        const apiKeyTable = `tvo-security-scan-account-apikey-${awsStage}`
        return createApiKeyRepository({
          tableName: apiKeyTable,
          awsStage,
          awsEndpoint
        })
      }
    }
  ]
})
export class TaskCliFilesModule {}
