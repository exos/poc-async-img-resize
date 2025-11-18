import { Injectable } from '@nestjs/common';
import { ConfigTreeService } from '@lib/config-tree';
import { validateConfig } from '@lib/config-validate';
import { SizeDefinitionDto } from './dto/size-definition.dto';

type Sizes = Record<string, SizeDefinitionDto>;

@Injectable()
export class SizesService {
    private readonly _sizes: Sizes;

    constructor(private readonly _configTreeService: ConfigTreeService) {
        const sizesConfig = this._configTreeService.get<Sizes>('IMG_SIZES');

        for (const [key, sizeDef] of Object.entries(sizesConfig)) {
            sizesConfig[key] = validateConfig<SizeDefinitionDto>(
                sizeDef,
                SizeDefinitionDto,
            );
        }

        this._sizes = sizesConfig;
    }

    public get sizes(): Sizes {
        return this._sizes;
    }

    public get availableSizeKeys(): string[] {
        return Object.keys(this._sizes);
    }
}
