import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Assignment } from './assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  // Create a new assignment
  async createAssignment(data: Partial<Assignment>) {
    const assignment = this.assignmentRepository.create(data);
    return this.assignmentRepository.save(assignment);
  }

  // Get all assignments
  async getAllAssignments() {
    return this.assignmentRepository.find();
  }

  // Get assignment by ID
  async getAssignmentById(id: string) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  // Update assignment by ID
  async updateAssignment(id: string, data: Partial<Assignment>) {
    const existing = await this.assignmentRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    // Merge incoming fields with existing db record
    const updatedAssignment = this.assignmentRepository.merge(existing, data);
    return this.assignmentRepository.save(updatedAssignment);
  }

  // Delete assignment
  async deleteAssignment(id: string): Promise<DeleteResult> {
    return this.assignmentRepository.delete(id);
  }
}
