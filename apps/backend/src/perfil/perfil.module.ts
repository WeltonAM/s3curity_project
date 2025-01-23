import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { DbModule } from 'src/db/db.module';
import { PerfilController } from './perfil.controller';
import { UsuarioMiddleware } from 'src/usuario/usuario.middleware';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PermissaoModule } from 'src/permissao/permissao.module';

@Module({
  imports: [DbModule, forwardRef(() => UsuarioModule), PermissaoModule],
  controllers: [PerfilController],
  providers: [PerfilPrisma],
  exports: [PerfilPrisma],
})
export class PerfilModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsuarioMiddleware).forRoutes(PerfilController);
  }
}
