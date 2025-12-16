import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany,OneToMany, JoinTable } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity'; // ⬅ Add this import

@Entity('all_courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  assignment: string;

  @Column({ nullable: true })
  filePath: string; // Store file path if file uploaded

  @CreateDateColumn()
  createdAt: Date;

 // course.entity.ts
@OneToMany(() => Enrollment, (e) => e.course)
enrollments: Enrollment[];

@Column({ default: false })
isDeleted: boolean;

}
