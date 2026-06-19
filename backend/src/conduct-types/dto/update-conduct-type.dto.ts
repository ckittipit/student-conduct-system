import { PartialType } from '@nestjs/swagger';
import { CreateConductTypeDto } from './create-conduct-type.dto';

export class UpdateConductTypeDto extends PartialType(CreateConductTypeDto) {}