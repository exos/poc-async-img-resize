import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Post()
    create(@Body() createImageDto: CreateImageDto) {
        return this.imagesService.create(createImageDto);
    }

    @Get()
    findAll() {
        return this.imagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.imagesService.findOne(+id);
    }

    @OnEvent('s3:ObjectCreated:CompleteMultipartUpload')
    async handleObjectCreatedEvent(payload: any) {
        const key = decodeURIComponent(payload?.s3?.object?.key ?? '');
        await this.imagesService.complete(key);
    }
}
