import {
    Controller, Get, Post, Body,
    Param, Delete, Query, UseGuards, Req, UseInterceptors,
    UploadedFile, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import type { Request } from 'express';
import { ConductRecordsService } from './conduct-records.service';
import { CreateConductRecordDto } from './dto/create-conduct-record.dto';
import { QueryConductRecordDto } from './dto/query-conduct-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('conduct-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conduct-records')
export class ConductRecordsController {
    constructor(private conductRecordsService: ConductRecordsService, private cloudinaryService: CloudinaryService,) {}

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

    // เพิ่ม upload endpoint:
    @Post(':id/evidence')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'อัปโหลดหลักฐานใบความประพฤติ' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB สำหรับเอกสาร
            fileFilter: (_, file, cb) => {
                const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!allowed.includes(file.mimetype)) {
                    return cb(new BadRequestException('อนุญาตเฉพาะ JPG, PNG, PDF'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadEvidence(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('กรุณาเลือกไฟล์');
        const result = await this.cloudinaryService.uploadImage(file, 'evidence');
        // อัปเดต evidenceUrl ใน record
        return this.conductRecordsService.updateEvidence(id, result.secure_url);
    }

}