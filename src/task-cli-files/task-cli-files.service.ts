import { Injectable } from '@nestjs/common'
import { TaskCliFilesInputDto, TaskCliFilesOutputDto } from './task-cli-files.dto'
import { ParameterService } from '@shared'
import { TaskCliFilesRepository } from './task-cli-files.repository'
import { StorageService } from '../storage/storage.service'
import { randomUUID } from 'crypto'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const ONE_DAY_IN_MS = ONE_DAY_IN_SECONDS * 1000

@Injectable()
export class TaskCliFilesService {
  constructor (private readonly parameterService: ParameterService, private readonly taskCliFilesRepository: TaskCliFilesRepository, private readonly storageService: StorageService) {}
  async process (input: TaskCliFilesInputDto): Promise<TaskCliFilesOutputDto> {
    const bucketName = await this.parameterService.get<string>('cli-files-bucket-name')
    const presignedUrls = await Promise.all(input.files.map(async (file) => {
      const fileKey = `temp/${input.batchId}/${file.name}`
      const presignedUrl = await this.storageService.getSignedUrl(bucketName, fileKey, file.contentType, ONE_DAY_IN_SECONDS)
      await this.taskCliFilesRepository.create({
        fileId: randomUUID(),
        batchId: input.batchId,
        fileKey,
        tti: Date.now() + ONE_DAY_IN_MS
      })
      return {
        [file.name]: presignedUrl
      }
    }))
    return {
      message: 'Files urls generated successfully',
      presignedUrls: presignedUrls.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }
  }
}
