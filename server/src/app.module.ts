import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './courses/course.module';
import { AssignmentModule } from './assignments/assignment.module';
import { SubmissionModule } from './submissions/submission.module';
import { EnrollmentModule } from './enrollments/enrollment.module'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'lms',
      autoLoadEntities: true,
      synchronize: true, // only for dev
    }),
    UserModule,
    AuthModule,
    CourseModule,
    AssignmentModule,
    SubmissionModule,
     EnrollmentModule, // ✅ AuthController and AuthService are included automatically
  ],
  controllers: [AppController], // Only AppController here
  providers: [AppService],      // Only AppService here
})
export class AppModule {}
