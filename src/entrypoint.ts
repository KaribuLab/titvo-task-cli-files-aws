import { NestFactory } from '@nestjs/core'
import { Context, APIGatewayProxyHandlerV2, APIGatewayProxyCallbackV2, APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda'
import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'
import { HttpStatus, INestApplicationContext, Logger as NestLogger } from '@nestjs/common'
import { findHeaderCaseInsensitive } from './utils/headers'
import { GetCliFilesSignedUrlsUseCase, GetCliFilesSignedUrlsInputDo, CliFile } from '@titvo/trigger'
import { NoAuthorizedApiKeyError, ApiKeyNotFoundError } from '@titvo/auth'
import { AppError } from '@titvo/shared'
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
const getCliFilesSignedUrlsUseCase = app.get(GetCliFilesSignedUrlsUseCase)

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2): Promise<APIGatewayProxyResultV2> => {
  logger.debug('Received event')
  try {
    const apiKey = findHeaderCaseInsensitive(event.headers, 'x-api-key')
    const body = JSON.parse(event.body ?? '{}')
    const source = body.source
    const files: CliFile[] = body.args.files.map((file: any): CliFile => ({ name: file.name, contentType: file.content_type }))
    const input: GetCliFilesSignedUrlsInputDo = {
      apiKey,
      batchId: body.args.batch_id,
      source,
      files
    }
    const output = await getCliFilesSignedUrlsUseCase.execute(input)
    return {
      statusCode: HttpStatus.OK,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: output.message,
        presigned_urls: output.urls
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
        body: JSON.stringify({ message: (error).message })
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
    if (error instanceof AppError) {
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
      body: JSON.stringify({ message: process.env.LOG_LEVEL === 'debug' ? (error as Error).message : 'Internal server error' })
    }
  }
}
