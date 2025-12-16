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
import { extname, join } from 'path';
import { AssignmentService } from './assignment.service';
import { Assignment } from './assignment.entity';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // ----------------- CREATE ASSIGNMENT -----------------
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'assignment_uploads'),
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createAssignment(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    if (!body.title || !body.description || !body.deadline) {
      throw new BadRequestException('Title, description, and deadline are required.');
    }

    const filePaths = files?.map((f) => `assignment_uploads/${f.filename}`) ?? [];

    const newAssignment: Partial<Assignment> = {
      title: body.title,
      description: body.description,
      link: body.link ?? null,
      deadline: new Date(body.deadline),
      files: filePaths,
    };

    return this.assignmentService.createAssignment(newAssignment);
  }

  // ----------------- GET ALL ASSIGNMENTS -----------------
  @Get()
  async getAssignments() {
    return this.assignmentService.getAllAssignments();
  }

  // ----------------- GET ASSIGNMENT BY ID -----------------
  @Get(':id')
  async getAssignment(@Param('id') id: string) {
    const assignment = await this.assignmentService.getAssignmentById(id);
    if (!assignment) throw new NotFoundException(`Assignment with ID ${id} not found`);
    return assignment;
  }

  // ----------------- UPDATE ASSIGNMENT -----------------
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'assignment_uploads'),
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateAssignment(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    const filePaths = files?.map((f) => `assignment_uploads/${f.filename}`) ?? [];

    const updatedAssignment: Partial<Assignment> = {
      title: body?.title,
      description: body?.description,
      link: body?.link ?? null,
      deadline: body?.deadline ? new Date(body.deadline) : undefined,
      files: filePaths.length ? filePaths : undefined,
    };

    const result = await this.assignmentService.updateAssignment(id, updatedAssignment);
    if (!result) throw new NotFoundException(`Assignment with ID ${id} not found`);
    return result;
  }

  // ----------------- DELETE ASSIGNMENT -----------------
  @Delete(':id')
  async deleteAssignment(@Param('id') id: string) {
    const deleted = await this.assignmentService.deleteAssignment(id);
    if (!deleted.affected) throw new NotFoundException(`Assignment with ID ${id} not found`);
    return { message: 'Assignment deleted successfully' };
  }

  // ----------------- STUDENT FILE UPLOAD -----------------
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'submission_uploads'),
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFiles(@Body('assignmentId') assignmentId: string, @UploadedFiles() files: Express.Multer.File[]) {
    if (!assignmentId) throw new BadRequestException('assignmentId is required');

    const filePaths = files?.map((f) => `submission_uploads/${f.filename}`) ?? [];

    return this.assignmentService.uploadFiles(assignmentId, filePaths);
  }
}
