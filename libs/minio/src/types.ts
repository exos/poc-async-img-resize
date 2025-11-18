export interface MinioModuleConfig {
    endPoint: string;
    port?: number;
    accessKey: string;
    secretKey: string;
    useSSL?: boolean;
}

export interface MinioModuleAsyncConfig {
    useFactory: (
        ...args: any[]
    ) => Promise<MinioModuleConfig> | MinioModuleConfig;
    inject?: any[];
    imports?: any[];
}

export const MINIO_MODULE_CONFIG = Symbol('MINIO_MODULE_CONFIG');
