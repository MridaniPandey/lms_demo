import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Assignment } from './assignment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), AuthModule],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
