import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourseService } from './course.service';
import { Course } from './course.entity';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Create a new course
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createCourse(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    if (!body.title || !body.desc) {
      throw new BadRequestException('Title and Description are required.');
    }

    const newCourse: Partial<Course> = {
      title: body.title,
      description: body.desc,
      assignment: body.assignment ?? undefined,
      filePath: file?.path ?? undefined, // Avoid null, use undefined
    };

    return this.courseService.createCourse(newCourse);
  }

  // Get all courses
  @Get()
  async getCourses() {
    return this.courseService.getAllCourses();
  }

  // Get a single course by ID
  @Get(':id')
  async getCourse(@Param('id') id: string) {
    const course = await this.courseService.getCourseById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update a course by ID
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateCourse(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedCourse: Partial<Course> = {
      title: body?.title,
      description: body?.desc,
      assignment: body?.assignment ?? undefined,
    };

    if (file) {
      updatedCourse.filePath = file.path;
    }

    const result = await this.courseService.updateCourse(id, updatedCourse);
    if (!result) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return result;
  }

  // Delete a course by ID
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    const deleted = await this.courseService.deleteCourse(id);
    if (!deleted.affected) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return { message: 'Course deleted successfully' };
  }
}
