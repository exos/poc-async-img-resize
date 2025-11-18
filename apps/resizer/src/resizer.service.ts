import type { Readable } from 'stream';
import { Injectable, Logger } from '@nestjs/common';
import { SizesService } from '@lib/sizes';
import queue from 'async/queue';
import { MinioService } from '@lib/minio';
import { ImageProcessorService } from './image-processor/image-processor.service';
import { ImageProcessorItemDto } from './dto/image-processor-item.dto';

@Injectable()
export class ResizerService {
    RAW_BUCKET = 'raw';
    PUBLIC_BUCKET = 'public';

    private readonly _logger = new Logger(ResizerService.name);
    private readonly _queue: queue<ImageProcessorItemDto, string>;

    constructor(
        private readonly _sizesService: SizesService,
        private readonly _imageProcessorService: ImageProcessorService,
        private readonly _minioService: MinioService,
    ) {
        this._queue = queue(
            (item: ImageProcessorItemDto, callback) =>
                this._handleResize(item)
                    .then((result) => callback(null, result))
                    .catch((err) => callback(err)),
            1, // concurrency
        );

        this._queue.error((err: Error, { key, size }) => {
            this._logger.error(
                `Error processing image for ${key} as ${size}: ${err.message}`,
                err.stack,
            );
        });

        this._queue.drain(() => {
            this._logger.log('All images have been processed');
        });

        this._queue.saturated(() => {
            if (this._queue.length() > 10) {
                this._logger.warn(
                    `Image processing queue is saturated with ${this._queue.length()} items pending`,
                );
            }
        });
    }

    private async _handleResize(item: ImageProcessorItemDto): Promise<string> {
        const { key, size } = item;
        this._logger.log(`Processing image ${key} for size ${size}`);

        const obj = await this._minioService.get(this.RAW_BUCKET, key);
        obj.on('error', (err) => {
            this._logger.error(
                `Error reading image ${key} from bucket ${this.RAW_BUCKET}: ${err.message}`,
                err.stack,
            );
        });
        const sizeDef = this._sizesService.sizes[size];

        const resizedImageStream = this._imageProcessorService.resizeImage(
            obj,
            sizeDef.width,
            sizeDef.height,
        );

        await this._minioService.put(
            this.PUBLIC_BUCKET,
            `${size}/${key}`,
            'image/png',
            resizedImageStream,
        );
        this._logger.log(
            `Successfully processed image ${key} for size ${size}`,
        );
        return `${size}/${key}`;
    }

    public resizeImage(key: string): void {
        for (const sizeKey of this._sizesService.availableSizeKeys) {
            this._queue.push({ key, size: sizeKey });
            this._logger.log(`Queued image ${key} for size ${sizeKey}`);
        }
    }
}
