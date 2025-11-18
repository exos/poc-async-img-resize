import type { Readable } from 'stream';
import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageProcesorService {
    private readonly _logger: Logger = new Logger(ImageProcesorService.name);

    constructor() {}

    public resizeImage(
        source: Readable,
        width: number,
        height: number,
    ): Readable {
        this._logger.log(`Resizing image to ${width}x${height}`);
        return source.pipe(
            sharp()
                .resize(width, height, {
                    fit: 'cover',
                    position: 'center',
                })
                .on('error', (err) => {
                    console.error('Error processing image:', err);
                })
                .png(),
        );
    }
}
