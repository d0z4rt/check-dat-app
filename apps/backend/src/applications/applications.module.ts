import { extname } from 'node:path'

import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { diskStorage } from 'multer'

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
          return cb(new Error('Seuls les fichiers APK sont autorisés'), false)
        }
        cb(null, true)
      },
      limits: {
        fileSize: 200 * 1024 * 1024 // 200MB max
      }
    })
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService]
})
export class ApplicationsModule {}
