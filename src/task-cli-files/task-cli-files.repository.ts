import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { Logger } from '@nestjs/common'
import { withRetry } from '../../shared/src/utils/aws.util'
import { TaskCliFile } from './task-cli-files.dto'
export interface TaskCliFilesRepositoryOptions {
  tableName: string
  awsStage: string
  awsEndpoint: string
}

export class TaskCliFilesRepository {
  private readonly logger = new Logger(TaskCliFilesRepository.name)
  private readonly tableName: string

  constructor (
    private readonly dynamoDBClient: DynamoDBClient,
    tableName: string
  ) {
    this.tableName = tableName
  }

  async create (taskCliFile: TaskCliFile): Promise<void> {
    await withRetry(async (): Promise<PutItemCommandOutput> => {
      const command = new PutItemCommand({
        TableName: this.tableName,
        Item: {
          file_id: {
            S: taskCliFile.fileId
          },
          batch_id: {
            S: taskCliFile.batchId
          },
          file_key: {
            S: taskCliFile.fileKey
          },
          tti: {
            N: taskCliFile.tti.toString()
          }
        }
      })
      return await this.dynamoDBClient.send(command)
    }, '', { logger: this.logger })
  }
}

export function createTaskCliFilesRepository (options: TaskCliFilesRepositoryOptions): TaskCliFilesRepository {
  const dynamoDBClient = options.awsStage === 'localstack'
    ? new DynamoDBClient({ endpoint: options.awsEndpoint })
    : new DynamoDBClient()

  return new TaskCliFilesRepository(dynamoDBClient, options.tableName)
}
