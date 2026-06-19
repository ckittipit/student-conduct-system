import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateStudentDto) {
        // เช็ค studentCode ซ้ำ
        const existing = await this.prisma.student.findUnique({
            where: { studentCode: dto.studentCode },
        });
        if (existing) throw new ConflictException('รหัสนักเรียนนี้มีอยู่แล้ว');

        return this.prisma.student.create({ data: dto as any });
    }

    async findAll(query: QueryStudentDto) {
        const { search, grade, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = { isActive: true };

        if (search) {
            where.OR = [
                { studentCode: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (grade) where.currentGrade = grade;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                orderBy: { studentCode: 'asc' },
            }),
            this.prisma.student.count({ where }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: string) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                conductRecords: {
                    include: { conductItem: { include: { conductType: true } } },
                    orderBy: { recordedAt: 'desc' },
                    take: 10,
                },
                    bonusRecords: {
                    orderBy: { recordedAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!student) throw new NotFoundException('ไม่พบนักเรียน');
        return student;
    }

    async update(id: string, dto: UpdateStudentDto) {
        await this.findOne(id); // เช็คว่ามีอยู่จริง
        return this.prisma.student.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        // Soft delete — ไม่ลบจริง แค่ซ่อน
        return this.prisma.student.update({
            where: { id },
            data: { isActive: false },
        });
    }
}