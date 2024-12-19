import { ProvedorAutenticacao } from "../../src";

export class ProvedorAutenticacaoMock implements ProvedorAutenticacao {
    async autenticarComProvedor(provedor: string, token: string): Promise<string> {
        if (provedor === "google" && token === "valid-token-google") {
            return "google@teste.com";
        } else if (provedor === "facebook" && token === "valid-token-facebook") {
            return "facebook@teste.com";
        } else {
            throw new Error("Autenticação falhou: Provedor ou token inválido.");
        }
    }
}
