import {
    Controller, Get, Post, Body,
    Param, Delete, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { ConductRecordsService } from './conduct-records.service';
import { CreateConductRecordDto } from './dto/create-conduct-record.dto';
import { QueryConductRecordDto } from './dto/query-conduct-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('conduct-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conduct-records')
export class ConductRecordsController {
    constructor(private conductRecordsService: ConductRecordsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'บันทึกความผิด (ตัดคะแนน)' })
    create(@Body() dto: CreateConductRecordDto, @Req() req: Request) {
        // ดึง user id จาก JWT ที่ JwtStrategy parse ให้แล้ว
        // ไม่รับ recordedById จาก body เพื่อป้องกัน user แอบอ้างเป็นคนอื่น
        const user = req.user as any;
        return this.conductRecordsService.create(dto, user.id);
    }

    @Get('student/:studentId')
    @ApiOperation({ summary: 'ดึงประวัติความผิดของนักเรียน (กรองเดือน/ปีได้)' })
    findByStudent(
        @Param('studentId') studentId: string,
        @Query() query: QueryConductRecordDto,
    ) {
        return this.conductRecordsService.findByStudent(studentId, query);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'ลบบันทึกความผิดและคืนคะแนน' })
    remove(@Param('id') id: string) {
        return this.conductRecordsService.remove(id);
    }
}