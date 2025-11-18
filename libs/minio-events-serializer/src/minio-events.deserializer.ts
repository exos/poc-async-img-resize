export interface RawPayload {
    Event: Record<string, unknown>[];
    EventTime: string;
}

export class MinioDeserializer {
    deserialize(raw: RawPayload[]): { pattern: string; data: any } {
        if (typeof raw === 'string') {
            raw = JSON.parse(raw) as RawPayload[];
        }

        if (!Array.isArray(raw)) {
            throw new Error('Unknow format');
        }

        if (raw.length !== 1) {
            throw new Error('Only single event is supported');
        }

        if (!('Event' in raw[0])) {
            throw new Error('Invalid event format: missing EventName');
        }

        if (!Array.isArray(raw[0].Event)) {
            throw new Error('Invalid event format: Event is not an array');
        }

        if (!('eventName' in raw[0].Event[0])) {
            throw new Error('Invalid event format: missing EventName');
        }

        const pack = {
            pattern: raw[0].Event[0]['eventName'] as string,
            data: raw[0].Event[0],
        };

        return pack;
    }
}
