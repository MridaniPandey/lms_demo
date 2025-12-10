import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}
