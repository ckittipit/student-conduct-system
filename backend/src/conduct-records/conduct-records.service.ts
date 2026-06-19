import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConductRecordDto } from './dto/create-conduct-record.dto';
import { QueryConductRecordDto } from './dto/query-conduct-record.dto';

@Injectable()
export class ConductRecordsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateConductRecordDto, recordedById: string) {
        // 1. ตรวจสอบว่า conductItem มีอยู่จริง และดึง pointDeduction
        const conductItem = await this.prisma.conductItem.findUnique({
            where: { id: dto.conductItemId, isActive: true },
        });
        if (!conductItem) throw new NotFoundException('ไม่พบรายการความผิด');

        // 2. ตรวจสอบว่านักเรียนมีอยู่จริง
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId, isActive: true },
        });
        if (!student) throw new NotFoundException('ไม่พบนักเรียน');

        // 3. เช็คคะแนนไม่ติดลบ
        const newPoints = student.totalPoints - conductItem.pointDeduction;
        if (newPoints < 0) throw new BadRequestException('คะแนนไม่พอหักแล้ว');

        // 4. ใช้ transaction — บันทึก record และอัปเดตคะแนนพร้อมกัน
        // ถ้าขั้นตอนใดขั้นตอนหนึ่งล้มเหลว จะ rollback ทั้งคู่
        // ป้องกันปัญหา record บันทึกแต่คะแนนไม่อัปเดต หรือกลับกัน
        const [record] = await this.prisma.$transaction([
            this.prisma.conductRecord.create({
                data: {
                    studentId: dto.studentId,
                    conductItemId: dto.conductItemId,
                    recordedById,
                    pointsDeducted: conductItem.pointDeduction, // snapshot คะแนน ณ เวลานั้น
                    remarkCategory: dto.remarkCategory,
                    note: dto.note,
                    evidenceUrl: dto.evidenceUrl,
                },
                include: {
                    conductItem: { include: { conductType: true } },
                    recordedBy: { select: { id: true, name: true } },
                },
            }),
            this.prisma.student.update({
                where: { id: dto.studentId },
                data: { totalPoints: newPoints },
            }),
        ]);

        return record;
    }

    async findByStudent(studentId: string, query: QueryConductRecordDto) {
        const { month, year, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = { studentId };

        // กรองตามเดือน + ปี
        if (month || year) {
            where.recordedAt = {};

            if (year) {
                // แปลง พ.ศ. → ค.ศ. สำหรับ query
                const ceYear = year - 543;
                where.recordedAt.gte = new Date(`${ceYear}-01-01`);
                where.recordedAt.lt = new Date(`${ceYear + 1}-01-01`);
            }

            if (month && year) {
                const ceYear = year - 543;
                const startDate = new Date(ceYear, month - 1, 1);
                const endDate = new Date(ceYear, month, 1);
                where.recordedAt = { gte: startDate, lt: endDate };
            }
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.conductRecord.findMany({
                where,
                skip,
                take: limit,
                orderBy: { recordedAt: 'desc' },
                include: {
                    conductItem: { include: { conductType: true } },
                    recordedBy: { select: { id: true, name: true } },
                },
            }),
            this.prisma.conductRecord.count({ where }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async remove(id: string) {
        const record = await this.prisma.conductRecord.findUnique({
            where: { id },
        });
        if (!record) throw new NotFoundException('ไม่พบบันทึกความผิด');

        // ลบ record และคืนคะแนนกลับ ต้องทำพร้อมกันเสมอ
        await this.prisma.$transaction([
            this.prisma.conductRecord.delete({ where: { id } }),
            this.prisma.student.update({
                where: { id: record.studentId },
                data: { totalPoints: { increment: record.pointsDeducted } },
            }),
        ]);

        return { message: 'ลบบันทึกและคืนคะแนนเรียบร้อย' };
    }
}