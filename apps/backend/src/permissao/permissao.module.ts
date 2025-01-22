import { Module } from '@nestjs/common';
import { PermissaoPrisma } from './permissao.prisma';
import { PermissaoController } from './permissao.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [PermissaoPrisma],
  controllers: [PermissaoController],
  exports: [PermissaoPrisma],
})
export class PermissaoModule {}
