import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTestDto {
    @ApiProperty({
        example: 'Sample Resource',
        description: 'The name of the test resource',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'This is a description of the test resource',
        description: 'Detailed description of the resource',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 100,
        description: 'A numeric value for testing',
    })
    @IsNumber()
    value: number;
}
