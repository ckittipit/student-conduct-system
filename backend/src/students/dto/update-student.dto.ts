import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

// PartialType ทำให้ทุก field กลายเป็น optional อัตโนมัติ
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}