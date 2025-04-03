import { Module } from '@nestjs/common'
import { ParameterModule } from '@shared'
import { TaskCliFilesModule } from './task-cli-files/task-cli-files.module'

@Module({
  imports: [
    TaskCliFilesModule,
    ParameterModule.forRoot({
      parameterServiceOptions: {
        ttl: 60,
        awsEndpoint: process.env.AWS_ENDPOINT ?? 'http://localhost:4566',
        awsStage: process.env.AWS_STAGE ?? 'prod',
        parameterBasePath: '/tvo/security-scan',
        serviceName: 'task-cli-files'
      },
      isGlobal: true
    })
  ]
})
export class AppModule {}
