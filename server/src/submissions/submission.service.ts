import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { Assignment } from '../assignments/assignment.entity';
import { User } from '../user/user.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepo: Repository<Submission>,

    @InjectRepository(Assignment)
    private assignmentsRepo: Repository<Assignment>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // Create a submission
  async createSubmission(
    assignmentId: number,
    studentId: number,
    files: string[],
    link?: string,
  ) {
    const assignment = await this.assignmentsRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const student = await this.usersRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const submission = this.submissionsRepo.create({
      assignment,
      student,
      files,
      // link,
    });

    return this.submissionsRepo.save(submission);
  }

  // Get submissions for an assignment
  async getByAssignment(assignmentId: number) {
    return this.submissionsRepo.find({
      where: { assignment: { id: assignmentId } },
      relations: ['assignment', 'student'],
      order: {submittedAt: "DESC"},
    });
  }

  // Get submissions by student
  async getByStudent(studentId: number) {
    return this.submissionsRepo.find({
      where: { student: { id: studentId } },
      relations: ['assignment', 'student'],
    });
  }

  // Get single submission
  async getOne(id: number) {
    const submission = await this.submissionsRepo.findOne({
      where: { id },
      relations: ['assignment', 'student'],
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  // Delete submission
  async deleteSubmission(id: number) {
    const submission = await this.getOne(id);
    return this.submissionsRepo.remove(submission);
  }
}
