import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Enrollment } from '../enrollments/enrollment.entity'; // <-- import Enrollment

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Enrollment) // <-- inject Enrollment repository
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // Create a new course
  async createCourse(data: Partial<Course>) {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  // Get all courses
  async getAllCourses() {
    return this.courseRepository.find();
  }

  // Get a single course by ID
  async getCourseById(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: parseInt(id) } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  // Update a course by ID
  async updateCourse(id: string, data: Partial<Course>) {
    const existing = await this.courseRepository.findOne({ where: { id: parseInt(id) } });
    if (!existing) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    // Merge existing course with new data
    const updatedCourse = this.courseRepository.merge(existing, data);
    return this.courseRepository.save(updatedCourse);
  }

  // Delete a course by ID (safely removes related enrollments first)
  async deleteCourse(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: parseInt(id) } });
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);

    // Remove related enrollments first
    await this.enrollmentRepository.delete({ course: { id: course.id } });

    // Remove the course itself
    return this.courseRepository.remove(course);
  }
}
