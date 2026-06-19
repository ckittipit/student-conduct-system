import { Module } from '@nestjs/common';
import { ConductRecordsController } from './conduct-records.controller';
import { ConductRecordsService } from './conduct-records.service';

@Module({
  controllers: [ConductRecordsController],
  providers: [ConductRecordsService]
})
export class ConductRecordsModule {}
