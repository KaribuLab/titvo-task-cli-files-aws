import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { Logger } from '@nestjs/common'
import { withRetry } from '../../shared/src/utils/aws.util'
import { ApiKeyDto } from './api-key.dto'

export interface ApiKeyRepositoryOptions {
  tableName: string
  awsStage: string
  awsEndpoint: string
}

export class ApiKeyRepository {
  private readonly logger = new Logger(ApiKeyRepository.name)

  constructor (
    private readonly dynamoDBClient: DynamoDBClient,
    private readonly tableName: string
  ) {}

  /**
   * Finds an API Key by user ID
   * @param userId ID of the user
   * @returns ApiKeyDto or null if not found
   */
  async findByUserId (userId: string): Promise<ApiKeyDto | null> {
    try {
      const result = await withRetry(async () => {
        return await this.dynamoDBClient.send(
          new QueryCommand({
            TableName: this.tableName,
            IndexName: 'user_id_gsi',
            KeyConditionExpression: 'user_id = :userId',
            ExpressionAttributeValues: {
              ':userId': { S: userId }
            }
          })
        )
      }, `findByUserId(${userId})`, { logger: this.logger })

      if ((result.Items == null) || result.Items.length === 0) {
        return null
      }

      const item = result.Items[0]
      return {
        keyId: item.key_id?.S ?? '',
        userId: item.user_id?.S ?? '',
        apiKey: item.api_key?.S ?? ''
      }
    } catch (error) {
      this.logger.warn(`[ApiKeyRepository] Error finding by userId: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  /**
   * Finds an API Key by its value
   * @param apiKey Value of the API Key
   * @returns ApiKeyDto or null if not found
   */
  async findByApiKey (apiKey: string): Promise<ApiKeyDto | null> {
    try {
      const result = await withRetry(async () => {
        return await this.dynamoDBClient.send(
          new QueryCommand({
            TableName: this.tableName,
            IndexName: 'api_key_gsi',
            KeyConditionExpression: 'api_key = :apiKey',
            ExpressionAttributeValues: {
              ':apiKey': { S: apiKey }
            }
          })
        )
      }, `findByApiKey(${apiKey})`, { logger: this.logger })

      if ((result.Items == null) || result.Items.length === 0) {
        return null
      }

      const item = result.Items[0]
      return {
        keyId: item.key_id?.S ?? '',
        userId: item.user_id?.S ?? '',
        apiKey: item.api_key?.S ?? ''
      }
    } catch (error) {
      this.logger.warn(`[ApiKeyRepository] Error finding by apiKey: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }
}

export function createApiKeyRepository (options: ApiKeyRepositoryOptions): ApiKeyRepository {
  const dynamoDBClient = options.awsStage === 'localstack'
    ? new DynamoDBClient({ endpoint: options.awsEndpoint })
    : new DynamoDBClient()

  return new ApiKeyRepository(dynamoDBClient, options.tableName)
}
