export * from './minio-events.deserializer';

import { RawPayload, MinioDeserializer } from './minio-events.deserializer';

export const deserialize = (() => {
    let instance: MinioDeserializer;

    return (raw: RawPayload[]): { pattern: string; data: any } => {
        if (!instance) {
            instance = new MinioDeserializer();
        }
        return instance.deserialize(raw);
    };
})();
