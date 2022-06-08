import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global() // make prisma module available for all over the application modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
