import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { SubmissionsService } from './submission.service';
import { SubmissionsController } from './submission.controller';
import { Assignment } from '../assignments/assignment.entity';
import { User } from '../user/user.entity'; // adjust if you have student entity

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Assignment, User])],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
})
export class SubmissionModule {}
