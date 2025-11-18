import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisEventsModule } from '@lib/redis-events';
import { deserialize } from '@lib/minio-events-serializer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: 'db',
                port: 3306,
                username: 'root',
                password: config.get<string>('MARIADB_ROOT_PASSWORD'),
                database: config.get<string>('MARIADB_DATABASE'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        RedisEventsModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.get<string>('REDIS_HOST'),
                channel: configService.get<string>('REDIS_KEY'),
                deserializer: deserialize,
            }),
        }),
        ImagesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
