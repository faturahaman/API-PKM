import {
    IsArray,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateServiceFlowDto } from './create-service-flow.dto';

export class CreateServiceDto {
    @IsString()
    service_name: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceFlowDto)
    flows?: CreateServiceFlowDto[];
}
