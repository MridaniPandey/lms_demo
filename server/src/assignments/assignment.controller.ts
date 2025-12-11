import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AssignmentService } from './assignment.service';
import { Assignment } from './assignment.entity';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // Create a new assignment
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createAssignment(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!body.title || !body.description || !body.deadline) {
      throw new BadRequestException(
        'Title, description, and deadline are required.',
      );
    }

    const filePaths = files?.map((file) => file.path) ?? [];

    const newAssignment: Partial<Assignment> = {
      title: body.title,
      description: body.description,
      link: body.link ?? null,
      deadline: new Date(body.deadline),
      files: filePaths,
    };

    return this.assignmentService.createAssignment(newAssignment);
  }

  // Get all assignments
  @Get()
  async getAssignments() {
    return this.assignmentService.getAllAssignments();
  }

  // Get a single assignment by ID
  @Get(':id')
  async getAssignment(@Param('id') id: string) {
    const assignment = await this.assignmentService.getAssignmentById(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  // Update an assignment by ID
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateAssignment(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filePaths = files?.map((file) => file.path) ?? [];

    const updatedAssignment: Partial<Assignment> = {
      title: body?.title,
      description: body?.description,
      link: body?.link ?? null,
      deadline: body?.deadline ? new Date(body.deadline) : undefined,
      files: filePaths.length > 0 ? filePaths : undefined, // Only update if new files given
    };

    const result = await this.assignmentService.updateAssignment(
      id,
      updatedAssignment,
    );

    if (!result) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return result;
  }

  // Delete an assignment
  @Delete(':id')
  async deleteAssignment(@Param('id') id: string) {
    const deleted = await this.assignmentService.deleteAssignment(id);
    if (!deleted.affected) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return { message: 'Assignment deleted successfully' };
  }
}
