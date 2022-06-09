import { Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'

import { User } from '@prisma/client' // generated type by prisma

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log({ email })
    return user
  }

  @Patch()
  editUser() {
    console.log('edit')
  }
}
