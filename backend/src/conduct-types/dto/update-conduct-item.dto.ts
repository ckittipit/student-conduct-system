import { PartialType } from '@nestjs/swagger';
import { CreateConductItemDto } from './create-conduct-item.dto';

export class UpdateConductItemDto extends PartialType(CreateConductItemDto) {}