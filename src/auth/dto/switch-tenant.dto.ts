import { IsString, IsOptional } from 'class-validator';

export class SwitchTenantDto {
    @IsString()
    @IsOptional()
    tenant_id: string | null;
}
