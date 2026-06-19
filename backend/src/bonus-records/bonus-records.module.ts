import { Module } from '@nestjs/common';
import { BonusRecordsController } from './bonus-records.controller';
import { BonusRecordsService } from './bonus-records.service';

@Module({
  controllers: [BonusRecordsController],
  providers: [BonusRecordsService]
})
export class BonusRecordsModule {}
