import {
    Controller, Get, Post, Body, Patch,
    Param, Delete, Query, UseGuards, UseInterceptors,
    UploadedFile, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(
        private studentsService: StudentsService,
        private cloudinaryService: CloudinaryService
    ) {}

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
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'ลบนักเรียน (soft delete)' })
    remove(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }

    // เพิ่ม endpoint upload:
    @Post(':id/image')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'อัปโหลดรูปนักเรียน' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
    FileInterceptor('file', {
        storage: memoryStorage(), // เก็บใน memory ก่อน ไม่บันทึกลง disk
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (_, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new BadRequestException('อนุญาตเฉพาะไฟล์รูปภาพ'), false);
            }
            cb(null, true);
        },
    }),
        )
    
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('กรุณาเลือกไฟล์');
        const result = await this.cloudinaryService.uploadImage(file, 'students');
        return this.studentsService.updateImage(id, result.secure_url);
    }
}