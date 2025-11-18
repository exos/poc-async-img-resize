import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MinioService } from '@lib/minio';
import { SizesService } from '@lib/sizes';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { ImageSize } from './entities/imagesize.entity';

const RAW_BUCKET = 'raw';
const PUBLIC_BUCKET = 'public';

@Injectable()
export class ImagesService {
    private readonly _logger = new Logger(ImagesService.name);

    constructor(
        @InjectRepository(Image)
        private readonly _imageRepository: Repository<Image>,

        @InjectRepository(ImageSize)
        private readonly _imageSizeRepository: Repository<ImageSize>,

        private readonly _dataSource: DataSource,

        private readonly _minioService: MinioService,

        private readonly _sizesService: SizesService,
    ) {}

    async create(createImageDto: CreateImageDto) {
        return this._dataSource.transaction(async (tx) => {
            const image = tx.create(Image, {
                name: createImageDto.name,
                sizes: this._sizesService.availableSizeKeys.map((size) => ({
                    size,
                    proccessed: false,
                    url: null,
                })),
            });
            await tx.save(image);

            const key = `${image.id}`;

            const url = await this._minioService.getPutEndpoint(
                RAW_BUCKET,
                key,
                24 * 3600, // 24 hours
            );

            return {
                image,
                uploadUrl: url,
            };
        });
    }

    findAll() {
        return this._imageRepository.find();
    }

    findOne(id: number) {
        return this._imageRepository.findOne({
            where: { id },
        });
    }

    async complete(key: string) {
        const [size, ids] = key.split('/');
        const id = parseInt(ids, 10);

        if (!this._sizesService.availableSizeKeys.includes(size)) {
            throw new Error(`Invalid size key: ${size}`);
        }

        const surl = await this._minioService.getGetEndpoint(
            PUBLIC_BUCKET,
            key,
        );
        const url = surl
            .replace(/\?.*$/, '')
            .replace('minio:9000', 'localhost:9000');
        this._logger.log(
            `Image resized: ${key}, url: ${url}, saving as processed`,
        );

        await this._imageSizeRepository.update(
            {
                image: { id },
                size,
            },
            {
                proccessed: true,
                url,
            },
        );
    }
}
