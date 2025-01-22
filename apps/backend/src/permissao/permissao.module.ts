import { Module } from '@nestjs/common';
import { PermissaoPrisma } from './permissao.prisma';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [PermissaoPrisma],
  exports: [PermissaoPrisma],
})
export class PermissaoModule {}
