import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { QueueService } from '../queue/queue.service'
import { Application } from './application.entity'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private repository: Repository<Application>,
    private readonly queueService: QueueService
  ) {}

  async create(file: Express.Multer.File) {
    const fileBuffer = await fs.readFile(file.path)
    const hash = createHash('sha256').update(fileBuffer).digest('hex')

    const existingApp = await this.repository.findOne({ where: { hash } })

    if (existingApp) {
      await fs.unlink(file.path)
      throw new Error('Cette application a déjà été téléversée')
    }

    const application = this.repository.create({
      filename: file.originalname,
      filePath: file.path,
      hash,
      size: file.size
    })

    const savedApplication = await this.repository.save(application)

    await this.queueService.addToScanQueue(savedApplication)

    return savedApplication
  }

  async findAll() {
    return this.repository.find({ order: { createdAt: 'desc' } })
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } })
  }

  async update(id: string, data: Partial<Application>) {
    const application = await this.repository.findOneByOrFail({ id })
    return this.repository.save(Object.assign(application, data))
  }

  async delete(id: string) {
    const application = await this.repository.findOneByOrFail({ id })
    if (application) {
      await fs.unlink(application.filePath).catch(() => {})
      await this.repository.delete({ id })
    }
  }
}
