// enrollment.module.ts
import { Module } from '@nestjs/common'; // ✅ Module decorator
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentController } from './enrollment.controller'; // ✅ Import controller
import { EnrollmentService } from './enrollment.service'; // ✅ Import service
import { Enrollment } from './enrollment.entity'; // ✅ Import entity

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
