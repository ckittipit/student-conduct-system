import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { ConductTypesModule } from './conduct-types/conduct-types.module';
import { ConductRecordsModule } from './conduct-records/conduct-records.module';
import { BonusRecordsModule } from './bonus-records/bonus-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    StudentsModule,
    ConductTypesModule,
    ConductRecordsModule,
    BonusRecordsModule,
  ],
})
export class AppModule {}
