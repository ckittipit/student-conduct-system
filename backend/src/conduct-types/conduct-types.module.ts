import { Module } from '@nestjs/common';
import { ConductTypesController } from './conduct-types.controller';
import { ConductTypesService } from './conduct-types.service';

@Module({
  controllers: [ConductTypesController],
  providers: [ConductTypesService]
})
export class ConductTypesModule {}
