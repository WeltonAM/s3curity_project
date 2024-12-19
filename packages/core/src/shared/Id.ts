import { v4 as uuid, validate } from "uuid";

export default class Id {
    readonly valor: string;

    constructor(valor?: string) {
        this.valor = valor ?? uuid();

        if (!this.ehValido(this.valor)) {
            throw new Error("Id inválido. O valor não pode ser vazio ou inválido.");
        }
    }

    static get novo() {
        return new Id();
    }

    igual(id: Id): boolean {
        return this.valor === id.valor;
    }

    diferente(id: Id): boolean {
        return this.valor !== id.valor;
    }

    private ehValido(valor: string): boolean {
        return valor.trim().length > 0 && validate(valor);
    }
}
