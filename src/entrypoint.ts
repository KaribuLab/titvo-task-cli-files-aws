import { NestFactory } from '@nestjs/core'
import { Context, APIGatewayProxyHandlerV2, APIGatewayProxyCallbackV2, APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda'
import { TaskCliFilesService } from './task-cli-files/task-cli-files.service'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'
import { ParameterService } from '@shared'
import { HttpStatus, INestApplicationContext, Logger as NestLogger } from '@nestjs/common'
import { findHeaderCaseInsensitive } from './utils/headers'
import { TaskCliFilesInputDto, CliFile } from './task-cli-files/task-cli-files.dto'
import { NoAuthorizedApiKeyError, ApiKeyNotFoundError } from './auth/auth.error'
import { ActionError } from './common/common.error'

const logger = new NestLogger('TaskCliFilesHandler')

async function initApp (): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true
  })
  await app.init()
  app.useLogger(app.get(Logger))
  app.flushLogs()
  return app
}

const app = await initApp()
app.get(ParameterService)
const taskCliFilesService = app.get(TaskCliFilesService)

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2): Promise<APIGatewayProxyResultV2> => {
  logger.debug('Received event')
  try {
    const apiKey = findHeaderCaseInsensitive(event.headers, 'x-api-key')
    const body = JSON.parse(event.body ?? '{}')
    const source = body.source
    const files: CliFile[] = body.args.files.map((file: any): CliFile => ({ name: file.name, contentType: file.content_type }))
    const input: TaskCliFilesInputDto = {
      apiKey,
      batchId: body.args.batch_id,
      source,
      files
    }
    const output = await taskCliFilesService.process(input)
    return {
      statusCode: HttpStatus.OK,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: output.message,
        presigned_urls: output.presignedUrls
      })
    }
  } catch (error) {
    logger.error('Error processing task trigger')
    logger.error(error)
    if (error instanceof ApiKeyNotFoundError) {
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: HttpStatus.UNAUTHORIZED,
        body: JSON.stringify({ message: error.message })
      }
    }
    if (error instanceof NoAuthorizedApiKeyError) {
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: HttpStatus.UNAUTHORIZED,
        body: JSON.stringify({ message: error.message })
      }
    }
    if (error instanceof ActionError) {
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: HttpStatus.BAD_REQUEST,
        body: JSON.stringify({ message: error.message })
      }
    }
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
