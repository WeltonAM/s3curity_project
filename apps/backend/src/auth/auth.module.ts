import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BcryptProvider } from 'src/usuario/bcrypt.provider';
import { LoginModule } from 'src/login/login.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PerfilModule } from 'src/perfil/perfil.module';
import { PermissaoModule } from 'src/permissao/permissao.module';
import ProvedorAutenticacaoGoogle from 'src/google/ProvedorAutenticacaoGoogle';
import { AuthService } from './auth.service';

@Module({
  imports: [LoginModule, UsuarioModule, PerfilModule, PermissaoModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptProvider, ProvedorAutenticacaoGoogle],
})
export class AuthModule {}
