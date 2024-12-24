import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
      { perfilId: adminPerfil.id, permissaoId: visualizarRelatorios.id },
      { perfilId: adminPerfil.id, permissaoId: criarUsuarios.id },
      { perfilId: adminPerfil.id, permissaoId: editarUsuarios.id },
      { perfilId: adminPerfil.id, permissaoId: excluirComentarios.id },

      {
        perfilId: usuarioPadraoPerfil.id,
        permissaoId: visualizarRelatorios.id,
      },

      { perfilId: editorPerfil.id, permissaoId: visualizarRelatorios.id },
      { perfilId: editorPerfil.id, permissaoId: editarUsuarios.id },
    ],
    skipDuplicates: true,
  });

  await prisma.usuario.createMany({
    data: [
      {
        email: 'admin@sistema.com',
        senha: 'hashed-password-admin',
        doisFatoresAtivado: true,
        telefone: '+5511999999999',
        nomeCompleto: 'Administrador Sistema',
      },
      {
        email: 'usuario@sistema.com',
        senha: 'hashed-password-user',
        nomeCompleto: 'Usuário Padrão',
      },
      {
        email: 'editor@sistema.com',
        senha: 'hashed-password-editor',
        nomeCompleto: 'Editor Sistema',
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
      { usuarioId: adminUsuario.id, perfilId: adminPerfil.id },
      { usuarioId: usuarioPadrao.id, perfilId: usuarioPadraoPerfil.id },
      { usuarioId: editorUsuario.id, perfilId: editorPerfil.id },
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
