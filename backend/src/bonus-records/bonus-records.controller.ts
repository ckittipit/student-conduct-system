import {
    Controller, Get, Post, Body, Patch,
    Param, Delete, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { BonusRecordsService } from './bonus-records.service';
import { CreateBonusRecordDto } from './dto/create-bonus-record.dto';
import { UpdateBonusRecordDto } from './dto/update-bonus-record.dto';
import { QueryBonusRecordDto } from './dto/query-bonus-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('bonus-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bonus-records')
export class BonusRecordsController {
    constructor(private bonusRecordsService: BonusRecordsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'เพิ่มคะแนนนักเรียน' })
    create(@Body() dto: CreateBonusRecordDto, @Req() req: Request) {
        const user = req.user as any;
        return this.bonusRecordsService.create(dto, user.id);
    }

    @Get('student/:studentId')
    @ApiOperation({ summary: 'ดึงประวัติการเพิ่มคะแนนของนักเรียน' })
    findByStudent(
        @Param('studentId') studentId: string,
        @Query() query: QueryBonusRecordDto,
    ) {
        return this.bonusRecordsService.findByStudent(studentId, query);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'แก้ไขรายการเพิ่มคะแนน (ปรับคะแนนนักเรียนอัตโนมัติ)' })
    update(@Param('id') id: string, @Body() dto: UpdateBonusRecordDto) {
        return this.bonusRecordsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'ลบรายการเพิ่มคะแนนและหักคะแนนคืน' })
    remove(@Param('id') id: string) {
        return this.bonusRecordsService.remove(id);
    }
}