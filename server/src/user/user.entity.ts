import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity'; // ⬅ Add this import


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length:100})
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "student" })   // DEFAULT ROLE
  role: string;

  // user.entity.ts
@OneToMany(() => Enrollment, (e) => e.student)
enrollments: Enrollment[];

}
