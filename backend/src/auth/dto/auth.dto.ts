import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email`, required: true, type: String, example: 'test@mail.com' })
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    name: 'password',
    description: `User's password`,
    required: true,
    type: String,
    example: 'qwerty12345',
    minLength: 6,
  })
  password: string
}
