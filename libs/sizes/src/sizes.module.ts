import { Module } from '@nestjs/common';
import { ConfigTreeModule } from '@lib/config-tree';
import { SizesService } from './sizes.service';

@Module({
    imports: [ConfigTreeModule],
    providers: [SizesService],
    exports: [SizesService],
})
export class SizesModule {}
