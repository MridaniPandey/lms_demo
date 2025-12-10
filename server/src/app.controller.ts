import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {} // Inject UserService

  @Get()
  getHome() {
    return { message: "Backend is running" };
  }

  @Post('register')
  async register(@Body() body) {
    const { name, email, password } = body;

    // Check if email already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      return { message: "Email already exists" };
    }

    // Create user and hash password
    const user = await this.userService.createUser(name, email, password);

    // Return response without password
    return { 
      message: "User registered", 
      data: { id: user.id, name: user.name, email: user.email } 
    };
  }
}
