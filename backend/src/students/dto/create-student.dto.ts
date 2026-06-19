import { IsString, IsEnum, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GradeLevel } from '@prisma/client';

export class CreateStudentDto {
    @ApiProperty({ example: '12345' })
    @IsString()
    @Length(1, 20)
    studentCode?: string;

    @ApiProperty({ example: 'สมชาย' })
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'ใจดี' })
    @IsString()
    lastName?: string;

    @ApiProperty({ enum: GradeLevel, example: GradeLevel.M1 })
    @IsEnum(GradeLevel)
    currentGrade?: GradeLevel;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;
}