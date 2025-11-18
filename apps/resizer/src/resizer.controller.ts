import { Controller, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ResizerService } from './resizer.service';

@Controller()
export class ResizerController {
    private readonly _logger = new Logger(ResizerController.name);

    constructor(private readonly resizerService: ResizerService) {}

    @OnEvent('s3:ObjectCreated:Put')
    public async handleObjectCreatedPutEvent(payload: any): Promise<void> {
        const key: string | undefined = payload.s3?.object?.key;

        if (!key) {
            this._logger.error('Event payload does not contain object key');
            return;
        }
        this._logger.log(`Received new object creation event for key: ${key}`);

        this.resizerService.resizeImage(key);
    }
}
