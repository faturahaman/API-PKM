import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceFlowDto } from './create-service-flow.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateServiceFlowDto extends PartialType(CreateServiceFlowDto) {
    @IsOptional()
    @IsInt()
    id?: number;
}
