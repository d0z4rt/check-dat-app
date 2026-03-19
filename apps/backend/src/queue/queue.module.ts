import { BullModule } from '@nestjs/bullmq'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotifyModule } from 'src/notify/notify.module'

import { Application } from '../applications/application.entity'
import { ApplicationsModule } from '../applications/applications.module'
import { VirusTotalModule } from '../virus-total/virus-total.module'
import { QueueProcessor } from './queue.processor'
import { QueueService } from './queue.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    BullModule.registerQueue({
      name: 'scan'
    }),
    VirusTotalModule,
    forwardRef(() => ApplicationsModule),
    NotifyModule
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService]
})
export class QueueModule {}
