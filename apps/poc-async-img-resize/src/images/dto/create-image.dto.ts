import { IsString } from 'class-validator';

export class CreateImageDto {
    @IsString()
    name: string;
}
