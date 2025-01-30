import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BcryptProvider } from 'src/usuario/bcrypt.provider';
import { LoginModule } from 'src/login/login.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PerfilModule } from 'src/perfil/perfil.module';
import { PermissaoModule } from 'src/permissao/permissao.module';

@Module({
  imports: [LoginModule, UsuarioModule, PerfilModule, PermissaoModule],
  controllers: [AuthController],
  providers: [BcryptProvider],
})
export class AuthModule {}
