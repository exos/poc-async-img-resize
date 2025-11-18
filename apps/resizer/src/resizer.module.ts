import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisEventsModule } from '@lib/redis-events';
import { MinioModule } from '@lib/minio';
import { SizesModule } from '@lib/sizes';
import { deserialize } from '@lib/minio-events-serializer';
import { ResizerController } from './resizer.controller';
import { ResizerService } from './resizer.service';
import { ImageProcesorModule } from './image-procesor/image-procesor.module';

@Module({
    imports: [
        ConfigModule,
        EventEmitterModule.forRoot(),
        SizesModule,
        RedisEventsModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.get<string>('REDIS_HOST'),
                channel: configService.get<string>('REDIS_KEY'),
                deserializer: deserialize,
            }),
        }),
        MinioModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                endPoint: configService.get<string>('MINIO_ENDPOINT')!,
                port: parseInt(configService.get<string>('MINIO_PORT')!, 10),
                accessKey: configService.get<string>('RESIZE_MINIO_USER')!,
                secretKey: configService.get<string>('RESIZE_MINIO_PASSWORD')!,
            }),
        }),
        ImageProcesorModule,
    ],
    controllers: [ResizerController],
    providers: [ResizerService],
})
export class ResizerModule {}
