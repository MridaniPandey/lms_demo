import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  // Enroll student (frontend sends studentId and courseId)
  @Post()
  enroll(@Body() body: { studentId: number; courseId: number }) {
    return this.service.enroll(body.studentId, body.courseId);
  }

  // Get enrolled courses for a student
  @Get('student/:id')
  getStudentCourses(@Param('id') id: number) {
    return this.service.getStudentCourses(+id);
  }
}
