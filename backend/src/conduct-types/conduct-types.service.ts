import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConductTypeDto } from './dto/create-conduct-type.dto';
import { UpdateConductTypeDto } from './dto/update-conduct-type.dto';
import { CreateConductItemDto } from './dto/create-conduct-item.dto';
import { UpdateConductItemDto } from './dto/update-conduct-item.dto';

@Injectable()
export class ConductTypesService {
    constructor(private prisma: PrismaService) {}

  // ─── Conduct Types (ระดับที่ 1) ────────────────────────────────────────────

    async createType(dto: CreateConductTypeDto) {
        const existing = await this.prisma.conductType.findUnique({
            where: { name: dto.name },
        });
        if (existing) throw new ConflictException('ประเภทนี้มีอยู่แล้ว');

        return this.prisma.conductType.create({ data: dto } as any);
    }

    findAllTypes() {
        // ดึงพร้อม items ทั้งหมด เรียงตาม order
        // ใช้ include เพราะ frontend ต้องการแสดง dropdown 2 ระดับในครั้งเดียว
        return this.prisma.conductType.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }

    async updateType(id: string, dto: UpdateConductTypeDto) {
        await this.findTypeOrThrow(id);
        return this.prisma.conductType.update({ where: { id }, data: dto });
    }

    async removeType(id: string) {
        await this.findTypeOrThrow(id);
        // Soft delete ทั้ง type และ items ข้างใน
        await this.prisma.conductItem.updateMany({
            where: { conductTypeId: id },
            data: { isActive: false },
        });
        return this.prisma.conductType.update({
            where: { id },
            data: { isActive: false },
        });
    }

  // ─── Conduct Items (ระดับที่ 2) ────────────────────────────────────────────

    async createItem(typeId: string, dto: CreateConductItemDto) {
        // ตรวจว่า type นั้นมีอยู่จริงก่อน
        await this.findTypeOrThrow(typeId);
        return this.prisma.conductItem.create({
            data: { ...dto, conductTypeId: typeId } as any,
        });
    }

    async updateItem(typeId: string, itemId: string, dto: UpdateConductItemDto) {
        await this.findItemOrThrow(typeId, itemId);
        return this.prisma.conductItem.update({ where: { id: itemId }, data: dto });
    }

    async removeItem(typeId: string, itemId: string) {
        await this.findItemOrThrow(typeId, itemId);
        return this.prisma.conductItem.update({
            where: { id: itemId },
            data: { isActive: false },
        });
    }

  // ─── Private helpers ───────────────────────────────────────────────────────

    private async findTypeOrThrow(id: string) {
        const type = await this.prisma.conductType.findUnique({ where: { id } });
        if (!type || !type.isActive) throw new NotFoundException('ไม่พบประเภทความผิด');
        return type;
    }

    private async findItemOrThrow(typeId: string, itemId: string) {
        const item = await this.prisma.conductItem.findFirst({
            where: { id: itemId, conductTypeId: typeId, isActive: true },
        });
        if (!item) throw new NotFoundException('ไม่พบรายการความผิด');
        return item;
    }
}