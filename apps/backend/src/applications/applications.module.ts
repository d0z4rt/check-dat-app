import { extname } from 'node:path'

import { BadRequestException, forwardRef, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { diskStorage } from 'multer'

import { QueueModule } from '../queue/queue.module'
import { Application } from './application.entity'
import { ApplicationsController } from './applications.controller'
import { ApplicationsService } from './applications.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        }
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(apk)$/)) {
          return cb(
            new BadRequestException('Seuls les fichiers APK sont autorisés'),
            false
          )
        }
        cb(null, true)
      },
      limits: {
        fileSize: 200 * 1024 * 1024 // 200MB max
      }
    }),
    forwardRef(() => QueueModule)
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService]
})
export class ApplicationsModule {}
