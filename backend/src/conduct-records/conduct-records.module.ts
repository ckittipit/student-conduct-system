import { Module } from '@nestjs/common';
import { ConductRecordsController } from './conduct-records.controller';
import { ConductRecordsService } from './conduct-records.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ConductRecordsController],
  providers: [ConductRecordsService]
})
export class ConductRecordsModule {}
