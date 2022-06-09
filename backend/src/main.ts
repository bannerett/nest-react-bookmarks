import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // security to remove unknown dto props
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Bookmarks App')
    .setDescription('Bookmarks API description')
    .setVersion('0.1')
    .addTag('bookmarks')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(1234)
}
bootstrap()
