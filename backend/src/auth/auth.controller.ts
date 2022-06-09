import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthDto } from './dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ description: 'Request to create user', summary: 'User sign up' })
  @ApiBody({ description: 'User email and password', required: true, type: AuthDto })
  @ApiResponse({ status: 201, type: String })
  signup(@Body() dto: AuthDto) {
    console.log({ dto })
    return this.authService.signup(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ description: 'Log in with existing user credentials', summary: 'User log in' })
  @ApiBody({ description: 'User email and password', required: true, type: AuthDto })
  @ApiResponse({ status: 200, type: String })
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }
}
