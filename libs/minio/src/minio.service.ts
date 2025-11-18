import url from 'url';
import type { Readable } from 'stream';
import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { type MinioModuleConfig, MINIO_MODULE_CONFIG } from './types';

type RequiredMinioOptions = Required<MinioModuleConfig>;

@Injectable()
export class MinioService implements OnModuleInit {
    private readonly _options: RequiredMinioOptions;
    private readonly _logger: Logger = new Logger(MinioService.name);
    private _client: Minio.Client | null = null;

    constructor(
        @Inject(MINIO_MODULE_CONFIG)
        options: MinioModuleConfig,
    ) {
        this._options = {
            port: 9000,
            useSSL: false,
            ...options,
        };
        this._logger.log(
            `MinioService initialized with endPoint: ${this._options.endPoint}`,
        );
    }

    private get client(): Minio.Client {
        if (!this._client) {
            throw new Error('Minio client is not initialized yet');
        }

        return this._client;
    }

    async onModuleInit() {
        this._logger.log('MinioService module initialized');
        this._client = new Minio.Client({
            endPoint: this._options.endPoint,
            port: this._options.port,
            useSSL: this._options.useSSL,
            accessKey: this._options.accessKey,
            secretKey: this._options.secretKey,
        });
        this._logger.log('Conenct with', {
            endPoint: this._options.endPoint,
            port: this._options.port,
            useSSL: this._options.useSSL,
            accessKey: this._options.accessKey,
            secretKey: this._options.secretKey,
        });
        this._logger.log('Minio client created successfully');
    }

    public get(bucketName: string, key: string): Promise<Readable> {
        return this.client.getObject(bucketName, key);
    }

    public async put(
        bucketName: string,
        key: string,
        contentType: string,
        stream: Readable,
    ): Promise<void> {
        await this.client.putObject(bucketName, key, stream, undefined, {
            'Content-Type': contentType,
        });
    }

    public async getPutEndpoint(
        bucketName: string,
        key: string,
        expiresInSeconds?: number,
    ): Promise<string> {
        if (!expiresInSeconds) {
            expiresInSeconds = 3600; // 1 hour
        }

        return this.client.presignedPutObject(
            bucketName,
            key,
            expiresInSeconds,
        );
    }

    public async getGetEndpoint(
        bucketName: string,
        key: string,
    ): Promise<string> {
        return this.client.presignedUrl('GET', bucketName, key);
    }
}
