import { ActionError } from '../common/common.error'

export class ApiKeyNotFoundError extends ActionError {
  constructor (message: string) {
    super('api-key-not-found', message)
    this.name = 'ApiKeyNotFoundError'
  }
}

export class NoAuthorizedApiKeyError extends ActionError {
  constructor (message: string) {
    super('no-authorized-api-key', message)
    this.name = 'NoAuthorizedApiKeyError'
  }
}
