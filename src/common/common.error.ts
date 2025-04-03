export class ActionError extends Error {
  constructor (action: string, message: string) {
    super(`${action} failed: ${message}`)
  }
}
