import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, bodyParser: true })
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(Number(process.env.PORT) ?? 3010)
}

bootstrap()
