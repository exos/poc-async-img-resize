import { Module } from '@nestjs/common';
import { ImageProcesorService } from './image-procesor.service';

@Module({
    providers: [ImageProcesorService],
    exports: [ImageProcesorService],
})
export class ImageProcesorModule {}
