import {
    Controller, Get, Post, Body, Patch,
    Param, Delete, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConductTypesService } from './conduct-types.service';
import { CreateConductTypeDto } from './dto/create-conduct-type.dto';
import { UpdateConductTypeDto } from './dto/update-conduct-type.dto';
import { CreateConductItemDto } from './dto/create-conduct-item.dto';
import { UpdateConductItemDto } from './dto/update-conduct-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('conduct-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conduct-types')
export class ConductTypesController {
    constructor(private conductTypesService: ConductTypesService) {}

    // ─── Types ─────────────────────────────────────────────────────────────────

    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'สร้างประเภทความผิดใหม่' })
    createType(@Body() dto: CreateConductTypeDto) {
        return this.conductTypesService.createType(dto);
    }

    @Get()
    @ApiOperation({ summary: 'ดึงประเภทความผิดทั้งหมดพร้อมรายการ (ใช้สร้าง dropdown)' })
    findAllTypes() {
        return this.conductTypesService.findAllTypes();
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'แก้ไขประเภทความผิด' })
    updateType(@Param('id') id: string, @Body() dto: UpdateConductTypeDto) {
        return this.conductTypesService.updateType(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'ลบประเภทความผิด (soft delete ทั้ง type และ items)' })
    removeType(@Param('id') id: string) {
        return this.conductTypesService.removeType(id);
    }

    // ─── Items (nested route) ──────────────────────────────────────────────────
    // URL: /conduct-types/:typeId/items/:itemId
    // Nested route ทำให้ URL บอกความสัมพันธ์ชัดเจน — item อยู่ใต้ type

    @Post(':typeId/items')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'เพิ่มรายการความผิดใน type นั้น' })
    createItem(
        @Param('typeId') typeId: string,
        @Body() dto: CreateConductItemDto,
    ) {
        return this.conductTypesService.createItem(typeId, dto);
    }

    @Patch(':typeId/items/:itemId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'แก้ไขรายการความผิด' })
    updateItem(
        @Param('typeId') typeId: string,
        @Param('itemId') itemId: string,
        @Body() dto: UpdateConductItemDto,
    ) {
        return this.conductTypesService.updateItem(typeId, itemId, dto);
    }

    @Delete(':typeId/items/:itemId')
    @Roles(Role.ADMIN, Role.TEACHER)
    @ApiOperation({ summary: 'ลบรายการความผิด' })
    removeItem(
        @Param('typeId') typeId: string,
        @Param('itemId') itemId: string,
    ) {
        return this.conductTypesService.removeItem(typeId, itemId);
    }
}