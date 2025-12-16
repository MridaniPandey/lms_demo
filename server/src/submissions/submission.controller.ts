import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubmissionsService } from './submission.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads/submission_uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async createSubmission(
    @Body() body: { assignmentId: number; studentId: number },
    @UploadedFiles() uploaded: { files?: Express.Multer.File[] },
  ) {
    const filePaths = uploaded.files?.map(f => `submission_uploads/${f.filename}`) ?? [];
    return this.submissionsService.createSubmission(body.assignmentId, body.studentId, filePaths);
  }

  @Get('assignment/:id')
  async getByAssignment(@Param('id') assignmentId: number) {
    const submissions = await this.submissionsService.getByAssignment(+assignmentId);
    return submissions.map(sub => ({
      id: sub.id,
      assignmentId: sub.assignment.id,
      assignmentTitle: sub.assignment.title,
      studentFullName: sub.student.name,
      files: sub.files,
      submittedAt: sub.submittedAt,
    }));
  }

  @Get('student/:id')
  async getByStudent(@Param('id') studentId: number) {
    const submissions = await this.submissionsService.getByStudent(+studentId);
    return submissions.map(sub => ({
      id: sub.id,
      assignmentId: sub.assignment.id,
      studentFullName: sub.student.name,
      files: sub.files,
      submittedAt: sub.submittedAt,
    }));
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const sub = await this.submissionsService.getOne(+id);
    return {
      id: sub.id,
      assignmentId: sub.assignment.id,
      studentFullName: sub.student.name,
      files: sub.files,
      submittedAt: sub.submittedAt,
    };
  }

  @Delete(':id')
  async deleteSubmission(@Param('id') id: number) {
    return this.submissionsService.deleteSubmission(+id);
  }
}
