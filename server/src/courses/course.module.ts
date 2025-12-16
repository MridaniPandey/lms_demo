import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './course.entity';
import { AuthModule } from '../auth/auth.module';
import { Enrollment } from '../enrollments/enrollment.entity'; // <-- import this


@Module({
  imports: [TypeOrmModule.forFeature([Course,Enrollment]), AuthModule,],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
