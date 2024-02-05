import { IsEmail, IsNumber, MaxLength, MinLength, IsOptional } from 'class-validator';

export class User {
  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @IsNumber({}, { message: 'Age must be a number' })
  age!: number;

  @MinLength(3, { message: 'Staff number must be a minimum of 3 characters' })
  @MaxLength(8, { message: 'Staff number must be a maximum of 8 characters' })
  staffNumber!: string;
}
