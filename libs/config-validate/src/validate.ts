import { plainToClass } from 'class-transformer';

export function validateConfig<T>(config: any, configClass: new () => T): T {
    const validatedConfig = plainToClass(configClass, config, {
        enableImplicitConversion: true,
    });

    return validatedConfig;
}
