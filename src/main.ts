import 'source-map-support/register';
import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import { mainConfig } from './utils/main-config';
declare const module: any;

async function bootstrap(CPUs: number) {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    // logger: ['error', 'warn'],
  });
  const logger = new Logger(bootstrap.name);

  logger.error(`CPUs: ${CPUs}`);
  mainConfig(app);

  await app.listen(process.env.PORT || 3000, async () => {
    const url = await app.getUrl();
    logger.log(`Server is running in ${url} with ${CPUs} CPUs`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap(1);
