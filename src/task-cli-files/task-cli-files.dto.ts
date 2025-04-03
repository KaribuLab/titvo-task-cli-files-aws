export interface TaskCliFile {
  fileId: string
  batchId: string
  fileKey: string
  tti: number
}

export interface CliFile {
  name: string
  contentType: string
}

class TaskCliFilesInput {
  apiKey?: string
  batchId: string
  source: string
  files: CliFile[]
}

class TaskCliFilesOutput {
  message: string
  presignedUrls: Record<string, string>
}

export { TaskCliFilesInput as TaskCliFilesInputDto, TaskCliFilesOutput as TaskCliFilesOutputDto }
