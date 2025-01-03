import { PrismaClient } from '@prisma/client';
import { BcryptProvider } from '../src/usuario/bcrypt.provider';

const prisma = new PrismaClient();

async function main() {
  const bcryptProvider = new BcryptProvider();

  const senhaHashed = await bcryptProvider.criptografar('#Senha123');

  await prisma.permissao.createMany({
    data: [
      {
        nome: 'Visualizar Relatórios',
        descricao: 'Permite visualizar relatórios no sistema.',
      },
      {
        nome: 'Criar Usuários',
        descricao: 'Permite criar novos usuários no sistema.',
      },
      {
        nome: 'Editar Usuários',
        descricao: 'Permite editar informações de usuários existentes.',
      },
      {
        nome: 'Excluir Comentários',
        descricao: 'Permite excluir comentários no sistema.',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.perfil.createMany({
    data: [
      {
        nome: 'Administrador',
        descricao: 'Perfil com acesso total ao sistema.',
      },
      {
        nome: 'Usuário Padrão',
        descricao: 'Perfil com permissões básicas de uso do sistema.',
      },
      {
        nome: 'Editor',
        descricao: 'Perfil com permissões para editar conteúdo.',
      },
    ],
    skipDuplicates: true,
  });

  const [adminPerfil, usuarioPadraoPerfil, editorPerfil] =
    await prisma.perfil.findMany({
      where: { nome: { in: ['Administrador', 'Usuário Padrão', 'Editor'] } },
    });

  const [
    visualizarRelatorios,
    criarUsuarios,
    editarUsuarios,
    excluirComentarios,
  ] = await prisma.permissao.findMany({
    where: {
      nome: {
        in: [
          'Visualizar Relatórios',
          'Criar Usuários',
          'Editar Usuários',
          'Excluir Comentários',
        ],
      },
    },
  });

  await prisma.perfilPermissao.createMany({
    data: [
      { perfil_id: adminPerfil.id, permissao_id: visualizarRelatorios.id },
      { perfil_id: adminPerfil.id, permissao_id: criarUsuarios.id },
      { perfil_id: adminPerfil.id, permissao_id: editarUsuarios.id },
      { perfil_id: adminPerfil.id, permissao_id: excluirComentarios.id },

      {
        perfil_id: usuarioPadraoPerfil.id,
        permissao_id: visualizarRelatorios.id,
      },

      { perfil_id: editorPerfil.id, permissao_id: visualizarRelatorios.id },
      { perfil_id: editorPerfil.id, permissao_id: editarUsuarios.id },
    ],
    skipDuplicates: true,
  });

  await prisma.usuario.createMany({
    data: [
      {
        email: 'admin@sistema.com',
        senha: senhaHashed,
        dois_fatores_ativado: true,
        telefone: '+5511999999999',
        nome_completo: 'Administrador Sistema',
      },
      {
        email: 'usuario@sistema.com',
        senha: senhaHashed,
        nome_completo: 'Usuário Padrão',
      },
      {
        email: 'editor@sistema.com',
        senha: senhaHashed,
        nome_completo: 'Editor Sistema',
      },
    ],
    skipDuplicates: true,
  });

  const [adminUsuario, usuarioPadrao, editorUsuario] =
    await prisma.usuario.findMany({
      where: {
        email: {
          in: [
            'admin@sistema.com',
            'usuario@sistema.com',
            'editor@sistema.com',
          ],
        },
      },
    });

  await prisma.usuarioPerfil.createMany({
    data: [
      { usuario_id: adminUsuario.id, perfil_id: adminPerfil.id },
      { usuario_id: usuarioPadrao.id, perfil_id: usuarioPadraoPerfil.id },
      { usuario_id: editorUsuario.id, perfil_id: editorPerfil.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
