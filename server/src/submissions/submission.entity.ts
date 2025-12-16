import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Assignment } from '../assignments/assignment.entity';
import { User } from '../user/user.entity'; // Assuming you have a Student entity

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, assignment => assignment.id, { onDelete: 'CASCADE' })
  assignment: Assignment;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  student: User;

  @Column('simple-array', { nullable: true })
  files: string[]; // paths to uploaded files

  // @Column({ nullable: true })
  // link: string; // optional external submission link

  @CreateDateColumn()
  submittedAt: Date;
}
