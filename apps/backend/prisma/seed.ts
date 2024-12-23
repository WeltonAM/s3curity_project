import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  const permissoes = [
    {
      nome: 'Visualizar Relatórios',
      descricao: 'Permite visualizar relatórios do sistema.',
    },
    {
      nome: 'Editar Usuários',
      descricao: 'Permite editar informações de usuários.',
    },
    {
      nome: 'Excluir Comentários',
      descricao: 'Permite excluir comentários de usuários.',
    },
    {
      nome: 'Criar Usuários',
      descricao: 'Permite criar novos usuários no sistema.',
    },
    {
      nome: 'Gerenciar Perfis',
      descricao: 'Permite criar, alterar ou excluir perfis.',
    },
    {
      nome: 'Gerenciar Permissões',
      descricao: 'Permite criar, alterar ou excluir permissões.',
    },
  ];

  await prisma.permissao.createMany({
    data: permissoes.map((permissao) => ({
      nome: permissao.nome,
      descricao: permissao.descricao,
    })),
  });

  console.log(
    'Permissões criadas:',
    permissoes.map((p) => p.nome),
  );

  const permissoesCriadas = await prisma.permissao.findMany();

  const perfis = [
    {
      nome: 'Administrador',
      descricao: 'Perfil com todas as permissões do sistema.',
      permissoes: permissoesCriadas.map((permissao) => ({ id: permissao.id })),
    },
    {
      nome: 'Usuário Padrão',
      descricao: 'Perfil com permissões básicas de acesso ao sistema.',
      permissoes: permissoesCriadas
        .filter(
          (permissao) =>
            permissao.nome !== 'Gerenciar Perfis' &&
            permissao.nome !== 'Gerenciar Permissões',
        )
        .map((permissao) => ({ id: permissao.id })),
    },
  ];

  const createdPerfis = await Promise.all(
    perfis.map((perfil) =>
      prisma.perfil.create({
        data: {
          nome: perfil.nome,
          descricao: perfil.descricao,
          permissoes: {
            connect: perfil.permissoes,
          },
        },
      }),
    ),
  );

  console.log(
    'Perfis criados:',
    perfis.map((p) => p.nome),
  );

  const usuarios = [
    {
      nome: 'Admin Master',
      email: 'admin@example.com',
      senha: 'admin123',
      autenticacaoDoisFatoresAtiva: true,
      perfis: [createdPerfis[0].id],
    },
    {
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      senha: 'joao123',
      autenticacaoDoisFatoresAtiva: false,
      perfis: [createdPerfis[1].id],
    },
    {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      senha: 'maria123',
      autenticacaoDoisFatoresAtiva: true,
      perfis: [createdPerfis[1].id],
    },
  ];

  await Promise.all(
    usuarios.map((usuario) =>
      prisma.usuario.create({
        data: {
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          autenticacaoDoisFatoresAtiva: usuario.autenticacaoDoisFatoresAtiva,
          perfis: {
            connect: usuario.perfis.map((perfilId) => ({ id: perfilId })),
          },
        },
      }),
    ),
  );

  console.log(
    'Usuários criados:',
    usuarios.map((u) => u.nome),
  );
}

seed()
  .then(() => {
    console.log('Seeding completed.');
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
