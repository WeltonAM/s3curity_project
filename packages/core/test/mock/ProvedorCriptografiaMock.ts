import { ProvedorCriptografia } from "../../src"

export class ProvedorCriptografiaMock implements ProvedorCriptografia {
    async criptografar(_: string): Promise<string> {
        return "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly"
    }

    async comparar(senha: string, _: string): Promise<boolean> {
        return senha === "!Senha123"
    }
}