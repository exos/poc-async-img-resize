import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import IORedis from 'ioredis';
import {
    type RedisEventsModuleOptions,
    REDIS_EVENTS_MODULE_OPTIONS,
} from './types';

interface RequiredOptions
    extends Required<
        Omit<RedisEventsModuleOptions, 'password' | 'deserializer'>
    > {
    password?: string;
    deserializer?: RedisEventsModuleOptions['deserializer'];
}

@Injectable()
export class RedisEventsService implements OnModuleInit {
    private readonly _options: RequiredOptions;
    private readonly _logger: Logger = new Logger(RedisEventsService.name);
    private __stopped: boolean = false;

    private _client?: IORedis;

    constructor(
        private readonly _eventEmitter: EventEmitter2,

        // Inject the module options
        @Inject(REDIS_EVENTS_MODULE_OPTIONS)
        options: RedisEventsModuleOptions,
    ) {
        this._options = {
            host: options.host || 'localhost',
            port: options.port || 6379,
            channel: options.channel || 'nest:events',
            password: options.password || undefined,
            deserializer: options.deserializer || undefined,
        };
    }

    private _connect(): void {
        const { host, port, password } = this._options;
        this._client = new IORedis({
            host,
            port,
            password,
        });

        this._client.once('ready', () => {
            this._loop().catch((error) => {
                this._logger.error(
                    `[LOOP ERROR] Error in Redis event listening loop: ${error.message}`,
                    error.stack,
                );
            });
        });

        this._client.on('ready', () => {
            this._logger.log('[READY] Connected to Redis server');
        });

        this._client.on('error', (error) => {
            this._logger.error(
                `[ERROR] Redis error: ${error.message}`,
                error.stack,
            );
        });

        this._client.on('end', () => {
            this._logger.warn('[END] Disconnected from Redis server');
        });

        this._client.on('reconnecting', () => {
            this._logger.log(
                '[RECONNECTING] Attempting to reconnect to Redis server',
            );
        });
    }

    _handleMessage(message: any): void {
        let eventPayload: any;

        try {
            eventPayload = this._options.deserializer
                ? this._options.deserializer(message)
                : JSON.parse(message);
        } catch (error) {
            this._logger.error(
                `[DESERIALIZE ERROR] Failed to deserialize message: ${(error as Error).message}`,
                (error as Error).stack,
            );
            return;
        }

        if (!eventPayload || !eventPayload.pattern) {
            this._logger.error(
                '[INVALID PAYLOAD] Received invalid event payload',
                eventPayload,
            );
            return;
        }

        this._eventEmitter.emit(eventPayload.pattern, eventPayload.data);
    }

    private async _loop() {
        if (!this._client) {
            this._logger.error('[LOOP ERROR] Redis client is not initialized');
            return;
        }

        this._logger.log('[LOOP] Starting Redis event listening loop...');

        while (!this.__stopped) {
            const res = await this._client.brpop(this._options.channel, 0);

            if (res && res.length === 2) {
                const message = res[1];
                this._handleMessage(message);
            }
        }

        this._logger.log('Redis event listening loop has been stopped.');
    }

    async onModuleInit() {
        this._logger.log(
            `RedisEventsService initialized with host: ${this._options.host} with${this._options.password ? '' : 'out'} password`,
        );
        this._connect();
    }
}
