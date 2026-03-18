import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmConfigService } from './utils/typeorm-config.service'
import { validateConfig } from './utils/validate-config'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
