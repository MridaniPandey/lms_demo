import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {  // ✅ Must be exported
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
