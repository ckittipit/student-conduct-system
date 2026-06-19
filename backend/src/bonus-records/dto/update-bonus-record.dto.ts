import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

// Update ได้แค่ title และ pointsAdded ตาม requirement
export class UpdateBonusRecordDto {
    @ApiPropertyOptional({ example: 'ชนะการแข่งขันวิชาการ' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ enum: [5, 10, 20] })
    @IsOptional()
    @IsInt()
    @IsIn([5, 10, 20])
    pointsAdded?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
}