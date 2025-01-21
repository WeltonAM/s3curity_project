import { Module } from '@nestjs/common';
import { UsuarioMiddleware } from './usuario.middleware';
import { UsuarioController } from './usuario.controller';
import { DbModule } from 'src/db/db.module';
import { BcryptProvider } from './bcrypt.provider';
import { UsuarioPrisma } from './usuario.prisma';
import { LoginModule } from 'src/login/login.module';
import { PerfilModule } from 'src/perfil/perfil.module';

@Module({
  imports: [DbModule, LoginModule, PerfilModule],
  exports: [UsuarioMiddleware, UsuarioPrisma],
  controllers: [UsuarioController],
  providers: [UsuarioMiddleware, UsuarioPrisma, BcryptProvider],
})
export class UsuarioModule {}
