import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class CreateBonusRecordDto {
    @ApiProperty()
    @IsString()
    studentId!: string;

    @ApiProperty({ example: 'ชนะการแข่งขันกีฬา' })
    @IsString()
    title!: string;

    // จำกัดแค่ 3 ค่าตาม requirement
    @ApiProperty({ enum: [5, 10, 20] })
    @IsInt()
    @IsIn([5, 10, 20])
    pointsAdded!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
}