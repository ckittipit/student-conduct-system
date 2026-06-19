import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RemarkCategory } from '@prisma/client';

export class CreateConductRecordDto {
    @ApiProperty()
    @IsString()
    studentId!: string;

    @ApiProperty({ description: 'ID ของรายการความผิด (conduct item)' })
    @IsString()
    conductItemId!: string;

    @ApiPropertyOptional({ enum: RemarkCategory })
    @IsOptional()
    @IsEnum(RemarkCategory)
    remarkCategory?: RemarkCategory;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ description: 'Cloudinary URL ของหลักฐาน' })
    @IsOptional()
    @IsString()
    evidenceUrl?: string;
}