-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tokenRecuperacao" TEXT,
    "dataExpiracaoToken" TIMESTAMP(3),
    "doisFatoresAtivado" BOOLEAN NOT NULL DEFAULT false,
    "telefone" TEXT,
    "urlImagemPerfil" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_usuarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,

    CONSTRAINT "perfis_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_permissoes" (
    "id" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "permissaoId" TEXT NOT NULL,

    CONSTRAINT "perfis_permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_nome_key" ON "perfis"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_nome_key" ON "permissoes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_usuarios_usuarioId_perfilId_key" ON "perfis_usuarios"("usuarioId", "perfilId");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_permissoes_perfilId_permissaoId_key" ON "perfis_permissoes"("perfilId", "permissaoId");

-- AddForeignKey
ALTER TABLE "perfis_usuarios" ADD CONSTRAINT "perfis_usuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_usuarios" ADD CONSTRAINT "perfis_usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "permissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
