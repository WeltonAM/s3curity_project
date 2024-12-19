import { ProvedorCriptografia } from "../../src"

export class ProvedorCriptografiaMock implements ProvedorCriptografia {
    criptografar(_: string): string {
        return "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly"
    }

    comparar(senha: string, _: string): boolean {
        return senha === "!Senha123"
    }
}