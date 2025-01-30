import { PrismaClient } from '@prisma/client';
import { BcryptProvider } from '../src/usuario/bcrypt.provider';

const prisma = new PrismaClient();

async function main() {
  const bcryptProvider = new BcryptProvider();

  const senhaHashed = await bcryptProvider.criptografar('#Senha123');

  await prisma.permissao.createMany({
    data: [
      {
        slug: 'visualizar-relatorios',
        nome: 'Visualizar Relatórios',
        descricao: 'Permite visualizar relatórios no sistema.',
      },
      {
        slug: 'criar-usuarios',
        nome: 'Criar Usuários',
        descricao: 'Permite criar novos usuários no sistema.',
      },
      {
        slug: 'editar-usuarios',
        nome: 'Editar Usuários',
        descricao: 'Permite editar informações de usuários existentes.',
      },
      {
        slug: 'criar-perfis',
        nome: 'Criar Perfis',
        descricao: 'Permite criar novos perfis no sistema.',
      },
      {
        slug: 'editar-perfis',
        nome: 'Editar Perfis',
        descricao: 'Permite editar perfis no sistema.',
      },
      {
        slug: 'criar-permissoes',
        nome: 'Criar Permissões',
        descricao: 'Permite criar novas permissões no sistema.',
      },
      {
        slug: 'editar-permissoes',
        nome: 'Editar Permissões',
        descricao: 'Permite editar permissões existentes no sistema.',
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
        nome: 'Manager',
        descricao: 'Perfil com permissões intermediárias.',
      },
      {
        nome: 'Usuário Padrão',
        descricao: 'Perfil com permissões básicas.',
      },
    ],
    skipDuplicates: true,
  });

  const [adminPerfil, managerPerfil, usuarioPadraoPerfil] =
    await prisma.perfil.findMany({
      where: { nome: { in: ['Administrador', 'Manager', 'Usuário Padrão'] } },
    });

  const [
    visualizarRelatorios,
    criarUsuarios,
    editarUsuarios,
    criarPerfis,
    editarPerfis,
    criarPermissoes,
    editarPermissoes,
  ] = await prisma.permissao.findMany({
    where: {
      nome: {
        in: [
          'Visualizar Relatórios',
          'Criar Usuários',
          'Editar Usuários',
          'Criar Perfis',
          'Editar Perfis',
          'Criar Permissões',
          'Editar Permissões',
        ],
      },
    },
  });

  await prisma.perfilPermissao.createMany({
    data: [
      { perfil_id: adminPerfil.id, permissao_id: visualizarRelatorios.id },
      { perfil_id: adminPerfil.id, permissao_id: criarUsuarios.id },
      { perfil_id: adminPerfil.id, permissao_id: editarUsuarios.id },
      { perfil_id: adminPerfil.id, permissao_id: criarPerfis.id },
      { perfil_id: adminPerfil.id, permissao_id: editarPerfis.id },
      { perfil_id: adminPerfil.id, permissao_id: criarPermissoes.id },
      { perfil_id: adminPerfil.id, permissao_id: editarPermissoes.id },

      { perfil_id: managerPerfil.id, permissao_id: visualizarRelatorios.id },
      { perfil_id: managerPerfil.id, permissao_id: editarUsuarios.id },
      { perfil_id: managerPerfil.id, permissao_id: criarPerfis.id },
      { perfil_id: managerPerfil.id, permissao_id: editarPerfis.id },
      { perfil_id: managerPerfil.id, permissao_id: criarPermissoes.id },
      { perfil_id: managerPerfil.id, permissao_id: editarPermissoes.id },

      {
        perfil_id: usuarioPadraoPerfil.id,
        permissao_id: visualizarRelatorios.id,
      },
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
        horas_trabalho: '09:00 - 18:00',
        dias_trabalho: 'Seg,Ter,Qua,Qui,Sex',
      },
      {
        email: 'manager@sistema.com',
        senha: senhaHashed,
        nome_completo: 'Manager Sistema',
        horas_trabalho: '10:00 - 19:00',
        dias_trabalho: 'Seg,Qua,Sex',
      },
      {
        email: 'usuario@sistema.com',
        senha: senhaHashed,
        nome_completo: 'Usuário Padrão',
        horas_trabalho: '08:00 - 17:00',
        dias_trabalho: 'Ter,Qua,Sex',
      },
    ],
    skipDuplicates: true,
  });

  const [adminUsuario, managerUsuario, usuarioPadraoUsuario] =
    await prisma.usuario.findMany({
      where: {
        email: {
          in: [
            'admin@sistema.com',
            'manager@sistema.com',
            'usuario@sistema.com',
          ],
        },
      },
    });

  await prisma.usuarioPerfil.createMany({
    data: [
      { usuario_id: adminUsuario.id, perfil_id: adminPerfil.id },
      { usuario_id: managerUsuario.id, perfil_id: managerPerfil.id },
      {
        usuario_id: usuarioPadraoUsuario.id,
        perfil_id: usuarioPadraoPerfil.id,
      },
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
