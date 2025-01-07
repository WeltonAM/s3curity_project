import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import { LoginPrisma } from './login.prisma';

@Module({
  providers: [PrismaProvider, LoginPrisma],
  exports: [LoginPrisma],
})
export class LoginModule {}
