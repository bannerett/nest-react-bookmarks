import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signup(dto: AuthDto): Promise<{ access_token: string }> {
    try {
      const exists = await this.prismaService.user.findUnique({ where: { email: dto.email } })

      if (exists) throw new ForbiddenException('Credentials taken')
      // generate the pass
      const hash = await argon.hash(dto.password)

      // save new user
      const user = await this.prismaService.user.create({
        data: { email: dto.email, hash },
        select: { email: true, id: true, createdAt: true, updatedAt: true },
      })

      // return saved user
      return this.signToken(user.id, user.email)
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      throw e
    }
  }

  async login(dto: AuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { email: dto.email } })

      if (!user) throw new ForbiddenException('Incorrect credentials')

      const isPassMatch = await argon.verify(user.hash, dto.password)

      if (!isPassMatch) throw new UnauthorizedException('Incorrect credentials')

      return this.signToken(user.id, user.email)
    } catch (e: any) {
      throw e
    }
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }

    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, { expiresIn: '15m', secret })

    return {
      access_token: token,
    }
  }
}
