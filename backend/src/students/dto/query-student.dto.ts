import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GradeLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryStudentDto {
    @ApiPropertyOptional({ description: 'ค้นหาจากชื่อหรือรหัส' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: GradeLevel })
    @IsOptional()
    @IsEnum(GradeLevel)
    grade?: GradeLevel;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;
}