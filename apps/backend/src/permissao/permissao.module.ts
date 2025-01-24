import { forwardRef, Module } from '@nestjs/common';
import { PermissaoPrisma } from './permissao.prisma';
import { PermissaoController } from './permissao.controller';
import { DbModule } from 'src/db/db.module';
import { UsuarioMiddleware } from 'src/usuario/usuario.middleware';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [DbModule, forwardRef(() => UsuarioModule)],
  providers: [PermissaoPrisma],
  controllers: [PermissaoController],
  exports: [PermissaoPrisma],
})
export class PermissaoModule {
  configure(consumer: any) {
    consumer.apply(UsuarioMiddleware).forRoutes(PermissaoController);
  }
}
