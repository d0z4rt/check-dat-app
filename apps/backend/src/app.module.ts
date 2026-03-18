import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApplicationsModule } from './applications/applications.module'
import { TypeOrmConfigService } from './utils/typeorm-config.service'
import { validateConfig } from './utils/validate-config'
import { VirusTotalModule } from './virus-total/virus-total.module'

@Module({
  imports: [
    // Configuration init and validation using zod
    ConfigModule.forRoot({
      validate: validateConfig
    }),
    // Global throtling settings
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10000
      }
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    ApplicationsModule,
    VirusTotalModule
  ],
  controllers: [AppController],
  providers: [
    // Global guard for the ThrottlerModule
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    AppService
  ]
})
export class AppModule {}
