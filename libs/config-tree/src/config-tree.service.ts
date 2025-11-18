import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigTreeService {
    private _decode(v: string): unknown {
        try {
            return JSON.parse(v);
        } catch {
            return v;
        }
    }

    private _transform(v: [string, string][]): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        const sups = new Set<string>(v.map(([k]) => k.split(/_/g)[0]));

        for (const sup of sups) {
            const pval = v.find(([k]) => k === sup);

            if (pval) {
                result[sup] = this._decode(pval[1]);
                continue;
            }

            const subs = v
                .filter(([k]) => k.startsWith(sup + '_'))
                .map(
                    ([k, val]) =>
                        [k.slice(sup.length + 1), val] as [string, string],
                );
            result[sup] = this._transform(subs);
        }

        return result;
    }

    public get<T>(key: string): T {
        key = key.replace(/:/g, '_');

        if (key in process.env) {
            return this._decode(process.env[key]!) as T;
        }

        const parts = Object.entries(process.env || {})
            .filter(([k, _v]) => k.startsWith(key))
            .map(
                ([k, v]) =>
                    [k.slice(key.length).replace(/^_/, ''), v] as [
                        string,
                        string,
                    ],
            );

        return this._transform(parts) as T;
    }
}
