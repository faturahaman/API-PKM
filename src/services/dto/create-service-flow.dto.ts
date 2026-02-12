import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceFlowDto {
    @IsString()
    title_flow: string;

    @IsOptional()
    @IsString()
    description_flow?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    step_order?: number;
}