export interface EventPayload<T> {
    pattern: string;
    data: T;
}

export interface RedisEventsModuleOptions {
    host?: string;
    port?: number;
    password?: string;
    channel?: string;
    deserializer?: (data: any) => EventPayload<any>;
}

export interface RedisEventsModuleAsyncOptions {
    useFactory: (
        ...args: any[]
    ) => Promise<RedisEventsModuleOptions> | RedisEventsModuleOptions;
    inject?: any[];
    imports?: any[];
}

export const REDIS_EVENTS_MODULE_OPTIONS = 'REDIS_EVENTS_MODULE_OPTIONS';
