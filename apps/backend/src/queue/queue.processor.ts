import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'

import { ApplicationsService } from '../applications/applications.service'
import { NotifyService } from '../notify/notify.service'
import { VirusTotalService } from '../virus-total/virus-total.service'

@Processor('scan')
export class QueueProcessor extends WorkerHost {
  private readonly logger = new Logger(QueueProcessor.name)

  constructor(
    private virusTotalService: VirusTotalService,
    private readonly applicationsService: ApplicationsService,
    private readonly notifyService: NotifyService
  ) {
    super()
  }

  async process(job: Job) {
    const { applicationId, hash } = job.data

    this.logger.log(`Début du scan pour l'application ${applicationId}`)

    try {
      await this.applicationsService.update(applicationId, {
        scanStatus: 'SCANNING'
      })

      const result = await this.virusTotalService.scanFile(hash)

      await new Promise((resolve) => setTimeout(resolve, 10000))

      await this.applicationsService.update(applicationId, {
        scanStatus: result.status === 'MALICIOUS' ? 'MALICIOUS' : 'SAFE',
        scanResult: JSON.stringify(result)
      })

      this.notifyService.emitScanCompleted(applicationId, result)

      this.logger.log(`Scan terminé pour l'application ${applicationId}`)
    } catch (error) {
      this.logger.error(`Erreur lors du scan: ${error.message}`)

      await this.applicationsService.update(applicationId, {
        scanStatus: 'ERROR',
        scanResult: JSON.stringify({ error: error.message })
      })

      this.notifyService.emitScanFailed(applicationId, error)

      throw error
    }
  }
}
