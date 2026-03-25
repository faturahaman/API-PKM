import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SwitchTenantDto {
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Target Puskesmas ID to switch to' })
    @IsString()
    @IsOptional()
    tenant_id: string | null;
}
