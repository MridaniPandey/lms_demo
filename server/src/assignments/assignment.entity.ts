import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  files: string[]; // multiple file paths

  @Column({ nullable: true })
  link: string; // optional URL

  @Column({ type: 'timestamp' })
  deadline: Date; // assignment deadline


}
