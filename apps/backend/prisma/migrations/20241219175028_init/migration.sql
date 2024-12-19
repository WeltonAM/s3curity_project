-- CreateTable
CREATE TABLE "Permissao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenRecuperacaoSenha" TEXT,
    "dataExpiracaoToken" TIMESTAMP(3),
    "autenticacaoDoisFatoresAtiva" BOOLEAN NOT NULL DEFAULT false,
    "imagemPerfil" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerfilPermissoes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PerfilPermissoes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioPerfis" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UsuarioPerfis_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "_PerfilPermissoes_B_index" ON "_PerfilPermissoes"("B");

-- CreateIndex
CREATE INDEX "_UsuarioPerfis_B_index" ON "_UsuarioPerfis"("B");

-- AddForeignKey
ALTER TABLE "_PerfilPermissoes" ADD CONSTRAINT "_PerfilPermissoes_A_fkey" FOREIGN KEY ("A") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilPermissoes" ADD CONSTRAINT "_PerfilPermissoes_B_fkey" FOREIGN KEY ("B") REFERENCES "Permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioPerfis" ADD CONSTRAINT "_UsuarioPerfis_A_fkey" FOREIGN KEY ("A") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioPerfis" ADD CONSTRAINT "_UsuarioPerfis_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
