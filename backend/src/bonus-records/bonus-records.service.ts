import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBonusRecordDto } from './dto/create-bonus-record.dto';
import { UpdateBonusRecordDto } from './dto/update-bonus-record.dto';
import { QueryBonusRecordDto } from './dto/query-bonus-record.dto';

@Injectable()
export class BonusRecordsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateBonusRecordDto, recordedById: string) {
        const student = await this.prisma.student.findUnique({
            where: { id: dto.studentId, isActive: true },
        });
        if (!student) throw new NotFoundException('ไม่พบนักเรียน');

        // บันทึกและเพิ่มคะแนนพร้อมกันใน transaction เดียว
        const [record] = await this.prisma.$transaction([
            this.prisma.bonusRecord.create({
                data: {
                    studentId: dto.studentId,
                    recordedById,
                    title: dto.title,
                    pointsAdded: dto.pointsAdded,
                    note: dto.note,
                },
                include: {
                    recordedBy: { select: { id: true, name: true } },
                },
            }),
            this.prisma.student.update({
                where: { id: dto.studentId },
                data: { totalPoints: { increment: dto.pointsAdded } },
            }),
        ]);

        return record;
    }

    async findByStudent(studentId: string, query: QueryBonusRecordDto) {
        const { month, year, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = { studentId };

        if (month && year) {
            const ceYear = year - 543;
            where.recordedAt = {
                gte: new Date(ceYear, month - 1, 1),
                lt: new Date(ceYear, month, 1),
            };
        } else if (year) {
            const ceYear = year - 543;
            where.recordedAt = {
                gte: new Date(`${ceYear}-01-01`),
                lt: new Date(`${ceYear + 1}-01-01`),
            };
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.bonusRecord.findMany({
                where,
                skip,
                take: limit,
                orderBy: { recordedAt: 'desc' },
                include: {
                recordedBy: { select: { id: true, name: true } },
                },
            }),
            this.prisma.bonusRecord.count({ where }),
        ]);

        return {
        data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async update(id: string, dto: UpdateBonusRecordDto) {
        const record = await this.prisma.bonusRecord.findUnique({ where: { id } });
        if (!record) throw new NotFoundException('ไม่พบรายการเพิ่มคะแนน');

        // ถ้าเปลี่ยน pointsAdded ต้องปรับคะแนนนักเรียนด้วย
        // หาส่วนต่างระหว่างคะแนนใหม่กับเก่า
        const pointsDiff = (dto.pointsAdded ?? record.pointsAdded) - record.pointsAdded;

        if (pointsDiff !== 0) {
        // ตรวจสอบว่าหลังปรับแล้วคะแนนไม่ติดลบ
            const student = await this.prisma.student.findUnique({
                where: { id: record.studentId },
            });
            if (student!.totalPoints + pointsDiff < 0) {
                throw new BadRequestException('คะแนนจะติดลบหากลดคะแนนที่เพิ่มไป');
            }

            const [updated] = await this.prisma.$transaction([
                this.prisma.bonusRecord.update({ where: { id }, data: dto }),
                this.prisma.student.update({
                where: { id: record.studentId },
                data: { totalPoints: { increment: pointsDiff } },
                }),
            ]);
            return updated;
        }

        return this.prisma.bonusRecord.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        const record = await this.prisma.bonusRecord.findUnique({ where: { id } });
        if (!record) throw new NotFoundException('ไม่พบรายการเพิ่มคะแนน');

        // ลบ record และหักคะแนนที่เคยเพิ่มไปออก
        await this.prisma.$transaction([
            this.prisma.bonusRecord.delete({ where: { id } }),
            this.prisma.student.update({
                where: { id: record.studentId },
                data: { totalPoints: { decrement: record.pointsAdded } },
            }),
        ]);

        return { message: 'ลบรายการเพิ่มคะแนนเรียบร้อย' };
    }
}