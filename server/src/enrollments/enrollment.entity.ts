// enrollment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../courses/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;

  @CreateDateColumn()
  enrolledAt: Date;
}
