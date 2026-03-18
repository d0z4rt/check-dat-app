import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { VirusTotalService } from './virus-total.service'

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [VirusTotalService],
  exports: [VirusTotalService]
})
export class VirusTotalModule {}
