/**
 * Base class for API Key errors
 */
export class ApiKeyError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error thrown when a user ID is not found
 */
export class UserNotFoundError extends ApiKeyError {
  constructor (userId: string) {
    super(`No API key found for user ID: ${userId}`)
  }
}

/**
 * Error thrown when the provided API key is invalid for the user
 */
export class InvalidApiKeyError extends ApiKeyError {
  constructor () {
    super('Invalid API key')
  }
}
