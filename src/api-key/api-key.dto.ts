/**
 * DTO representing an API Key in the system
 */
export interface ApiKeyDto {
  /**
   * Unique identifier of the API Key
   */
  keyId: string

  /**
   * ID of the user who owns the API Key
   */
  userId: string

  /**
   * Value of the API Key
   */
  apiKey: string
}
