import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO สำหรับสร้างรายการความผิด (dropdown ระดับที่ 2)
export class CreateConductItemDto {
    @ApiProperty({ example: 'ผมยาวเกินกำหนด' })
    @IsString()
    name?: string;

    @ApiProperty({ example: 5, description: 'คะแนนที่ตัด' })
    @IsInt()
    @Min(1)
    pointDeduction?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}