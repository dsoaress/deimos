import { NestFactory } from '@nestjs/core'
import express, { NextFunction, Request, Response } from 'express'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, bodyParser: false })

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/subscriptions/webhooks') {
      express.raw({ type: 'application/json' })
      next()
    } else {
      express.json()(req, res, next)
    }
  })

  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(Number(process.env.PORT) ?? 3010)
}

bootstrap()
