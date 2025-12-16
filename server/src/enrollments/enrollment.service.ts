import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
  ) {}

  // Enroll a student in a course
  async enroll(studentId: number, courseId: number) {
    // Optional: role check if you have user repository
    // You can skip if frontend guarantees only students call this

    // Check if already enrolled
    const existing = await this.enrollmentRepo.findOne({
      where: { student: { id: studentId }, course: { id: courseId } },
    });
    if (existing) return existing;

    const enrollment = this.enrollmentRepo.create({
      student: { id: studentId },
      course: { id: courseId },
    });

    return this.enrollmentRepo.save(enrollment);
  }

  // Get all courses for a student
  async getStudentCourses(studentId: number) {
    const enrollments = await this.enrollmentRepo.find({
      where: {
        student: { id: studentId },
        course: { isDeleted: false },
      },
      relations: ['course'],
    });

    return enrollments.map((e) => e.course);
  }
}
