import { IsNumber, IsInt, IsPositive } from 'class-validator';

export class SizeDefinitionDto {
    @IsNumber()
    @IsInt()
    @IsPositive()
    width: number;

    @IsNumber()
    @IsInt()
    @IsPositive()
    height: number;
}
