import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /**
   * TODO restrict domain access
   */
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000'
    ],
    credentials: true
  })

  /**
   * Enable validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(process.env.PORT ?? 4000)
}
bootstrap()
