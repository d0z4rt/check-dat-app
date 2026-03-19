import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApplicationsModule } from './applications/applications.module'
import { NotifyModule } from './notify/notify.module'
import { QueueModule } from './queue/queue.module'
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379)
        }
      })
    }),
    ApplicationsModule,
    QueueModule,
    VirusTotalModule,
    NotifyModule
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
