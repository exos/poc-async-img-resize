import { Module, DynamicModule, Provider } from '@nestjs/common';
import { RedisEventsService } from './redis-events.service';
import {
    RedisEventsModuleOptions,
    RedisEventsModuleAsyncOptions,
    REDIS_EVENTS_MODULE_OPTIONS,
} from './types';

@Module({
    providers: [RedisEventsService],
})
export class RedisEventsModule {
    static forRoot(options: RedisEventsModuleOptions = {}): DynamicModule {
        const optionsProvider: Provider = {
            provide: REDIS_EVENTS_MODULE_OPTIONS,
            useValue: options,
        };

        return {
            module: RedisEventsModule,
            providers: [optionsProvider, RedisEventsService],
            exports: [RedisEventsService],
        };
    }

    static forRootAsync(options: RedisEventsModuleAsyncOptions): DynamicModule {
        const optionsProvider: Provider = {
            provide: REDIS_EVENTS_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        return {
            module: RedisEventsModule,
            imports: options.imports || [],
            providers: [optionsProvider, RedisEventsService],
            exports: [RedisEventsService],
        };
    }
}
