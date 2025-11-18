import { NestFactory } from '@nestjs/core';
import { ResizerModule } from './resizer.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ResizerModule);
    app.enableShutdownHooks();
}
bootstrap();
