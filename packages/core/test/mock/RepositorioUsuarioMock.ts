import { Usuario, RepositorioUsuario, Id } from "../../src";

export default class RepositorioUsuarioMock implements RepositorioUsuario {
    private usuarios: Usuario[] = [];

    async salvar(usuario: Partial<Usuario>): Promise<Partial<Usuario>> {
        const usuarioComId = {
            ...usuario,
            id: usuario.id ?? Id.novo.valor,
            criado_em: usuario.criado_em ?? new Date(),
            ativo: usuario.ativo ?? true,
        };

        const index = this.usuarios.findIndex((u) => u.id === usuarioComId.id);

        if (index >= 0) {
            this.usuarios[index] = usuarioComId as Usuario;
        } else {
            this.usuarios.push(usuarioComId as Usuario);
        }

        return usuarioComId;
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        const usuario = this.usuarios.find((u) => u.email === email);
        return usuario ?? null;
    }
}