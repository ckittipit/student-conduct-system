import {
    Controller, Get, Post, Body, Patch,
    Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(private studentsService: StudentsService) {}

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'เพิ่มนักเรียนใหม่' })
    create(@Body() dto: CreateStudentDto) {
        return this.studentsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'ดึงรายชื่อนักเรียนทั้งหมด (มี search + filter)' })
    findAll(@Query() query: QueryStudentDto) {
        return this.studentsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'ดึงข้อมูลนักเรียนรายคน' })
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'แก้ไขข้อมูลนักเรียน' })
    update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
        return this.studentsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'ลบนักเรียน (soft delete)' })
    remove(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }
}