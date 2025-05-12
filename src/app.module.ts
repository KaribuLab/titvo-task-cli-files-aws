import { Module } from '@nestjs/common'
import { CliFilesModule } from '@infrastructure/cli-files/cli-files.module'
import { ConfigModule } from '@titvo/aws'
import { LoggerModule } from 'nestjs-pino'
import { pino } from 'pino'

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
    }),
    ConfigModule.forRoot({
      configOptions: {
        awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566',
        awsStage: process.env.AWS_STAGE ?? 'prod',
        tableName: process.env.CONFIG_TABLE_NAME as string
      },
      isGlobal: true
    }),
    CliFilesModule
  ]
})
export class AppModule {}
