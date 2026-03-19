import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

import type { Application } from '../applications/application.entity'

@Injectable()
export class QueueService {
  constructor(@InjectQueue('scan') private scanQueue: Queue) {}

  async addToScanQueue(application: Application) {
    await this.scanQueue.add(
      'scan-file',
      {
        applicationId: application.id,
        hash: application.hash
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minute between tries
        }
      }
    )
  }
}
