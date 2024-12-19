import { Usuario, RepositorioUsuario, Id } from "../../src";

export default class RepositorioUsuarioMock implements RepositorioUsuario {
    private usuarios: Usuario[] = [];

    async salvar(usuario: Partial<Usuario>): Promise<void> {
        const usuarioComId = {
            ...usuario,
            id: usuario.id ?? Id.novo.valor,
        };

        const index = this.usuarios.findIndex((u) => u.id === usuarioComId.id);

        if (index >= 0) {
            this.usuarios[index] = usuarioComId as Usuario;
        } else {
            this.usuarios.push(usuarioComId as Usuario);
        }

        return Promise.resolve();
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        const usuario = this.usuarios.find((u) => u.email === email);
        return usuario ?? null;
    }
}
