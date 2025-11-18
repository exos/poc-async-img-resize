import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '@lib/minio';
import { SizesModule } from '@lib/sizes';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { Image } from './entities/image.entity';
import { ImageSize } from './entities/imagesize.entity';

@Module({
    imports: [
        SizesModule,
        TypeOrmModule.forFeature([Image, ImageSize]),
        MinioModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                endPoint: configService.get<string>('MINIO_ENDPOINT')!,
                port: parseInt(configService.get<string>('MINIO_PORT')!, 10),
                accessKey: configService.get<string>('API_MINIO_USER')!,
                secretKey: configService.get<string>('API_MINIO_PASSWORD')!,
            }),
        }),
    ],
    controllers: [ImagesController],
    providers: [ImagesService],
})
export class ImagesModule {}
