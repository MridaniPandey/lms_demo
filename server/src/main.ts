import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // // Serve assignment files
  // app.useStaticAssets(join(__dirname, '..', 'uploads', 'assignment_uploads'), {
  //   prefix: '/assignment_uploads/',
  // });

  // // Serve submission files
  // app.useStaticAssets(join(__dirname, '..', 'uploads', 'submission_uploads'), {
  //   prefix: '/submission_uploads/',
  // });

  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();
