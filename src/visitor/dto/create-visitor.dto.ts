import { IsOptional, IsString } from "class-validator";

export class CreateVisitorDto {
    @IsString()
    ip_address: string;

    @IsString()
    user_agent: string;

    @IsOptional()
    @IsString()
    path?: string;
}