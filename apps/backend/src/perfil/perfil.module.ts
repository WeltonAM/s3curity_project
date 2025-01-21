import { Module } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [PerfilPrisma],
  exports: [PerfilPrisma],
})
export class PerfilModule {}
