import { Module } from '@nestjs/common';
import { ConfigTreeService } from './config-tree.service';

@Module({
    providers: [ConfigTreeService],
    exports: [ConfigTreeService],
})
export class ConfigTreeModule {}
