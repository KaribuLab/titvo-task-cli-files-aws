import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { TaskCliFile } from './task-cli-files.dto'
export interface TaskCliFilesRepositoryOptions {
  tableName: string
  awsStage: string
  awsEndpoint: string
}

export class TaskCliFilesRepository {
  private readonly tableName: string

  constructor (
    private readonly dynamoDBClient: DynamoDBClient,
    tableName: string
  ) {
    this.tableName = tableName
  }

  async create (taskCliFile: TaskCliFile): Promise<void> {
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
    await this.dynamoDBClient.send(command)
  }
}

export function createTaskCliFilesRepository (options: TaskCliFilesRepositoryOptions): TaskCliFilesRepository {
  const dynamoDBClient = options.awsStage === 'localstack'
    ? new DynamoDBClient({ endpoint: options.awsEndpoint })
    : new DynamoDBClient()

  return new TaskCliFilesRepository(dynamoDBClient, options.tableName)
}
