import { Module, DynamicModule, Provider } from '@nestjs/common';
import { MinioService } from './minio.service';
import {
    type MinioModuleConfig,
    type MinioModuleAsyncConfig,
    MINIO_MODULE_CONFIG,
} from './types';

@Module({
    providers: [MinioService],
    exports: [MinioService],
})
export class MinioModule {
    static forRoot(config: MinioModuleConfig): DynamicModule {
        const configProvider: Provider = {
            provide: MINIO_MODULE_CONFIG,
            useValue: config,
        };
        return {
            module: MinioModule,
            providers: [configProvider, MinioService],
            exports: [MinioService],
        };
    }

    static forRootAsync(options: MinioModuleAsyncConfig): DynamicModule {
        const configProvider: Provider = {
            provide: MINIO_MODULE_CONFIG,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
        return {
            module: MinioModule,
            imports: options.imports || [],
            providers: [configProvider, MinioService],
            exports: [MinioService],
        };
    }
}
