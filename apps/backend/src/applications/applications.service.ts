import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'

import { Injectable, InternalServerErrorException } from '@nestjs/common'
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
    // previous implementation loading the full file in memory
    // const fileBuffer = await fs.readFile(file.path)
    // const hash = createHash('sha256').update(fileBuffer).digest('hex')

    /**
     * Prevent Out Of Memory using a read stream
     * Updates the hash incrementally with each chunk
     */
    let hash: string
    try {
      hash = await new Promise((resolve, reject) => {
        const hashInstance = createHash('sha256')
        const stream = createReadStream(file.path)
        stream.on('error', (err) => reject(err))
        stream.on('data', (chunk) => hashInstance.update(chunk))
        stream.on('end', () => resolve(hashInstance.digest('hex')))
      })
    } catch {
      await fs.unlink(file.path).catch(() => {})
      throw new InternalServerErrorException('Erreur de traitement du fichier')
    }

    const existingApp = await this.repository.findOne({ where: { hash } })

    if (existingApp) {
      await fs.unlink(file.path).catch(() => {})
      throw new Error('Cette application a déjà été téléversée')
    }

    const application = this.repository.create({
      filename: file.originalname,
      filePath: file.path,
      hash,
      size: file.size
    })

    try {
      const savedApplication = await this.repository.save(application)
      await this.queueService.addToScanQueue(savedApplication)
      return savedApplication
    } catch {
      await fs.unlink(file.path).catch(() => {})
      throw new InternalServerErrorException(
        "Erreur de sauvegarde de l'application"
      )
    }
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
