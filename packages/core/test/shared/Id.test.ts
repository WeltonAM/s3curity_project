import Id from "../../src/shared/Id"

describe("Id", () => {
    it("deve criar um novo id válido", () => {
        const id = Id.novo;
        expect(id.valor).toHaveLength(36);
        expect(id.valor.trim()).not.toBe("");
    });

    it("deve lançar erro ao tentar criar um id inválido", () => {
        expect(() => new Id("123")).toThrow(
            "Id inválido. O valor não pode ser vazio ou inválido."
        );
        expect(() => new Id("")).toThrow(
            "Id inválido. O valor não pode ser vazio ou inválido."
        );
    });

    it("deve criar um novo id válido a partir de um id existente", () => {
        const valor = Id.novo.valor;
        const id = new Id(valor);
        expect(id.valor).toHaveLength(36);
        expect(id.valor).toBe(valor);
    });

    it("deve testar verdadeiro para ids iguais", () => {
        const id1 = Id.novo;
        const id2 = new Id(id1.valor);
        expect(id1.igual(id2)).toBe(true);
        expect(id1.diferente(id2)).toBe(false);
    });

    it("deve testar falso para ids diferentes", () => {
        const id1 = Id.novo;
        const id2 = Id.novo;
        expect(id1.igual(id2)).toBe(false);
        expect(id1.diferente(id2)).toBe(true);
    });

    it("deve lançar erro ao criar Id com valor vazio ou inválido", () => {
        expect(() => new Id("")).toThrow(
            "Id inválido. O valor não pode ser vazio ou inválido."
        );
        expect(() => new Id("invalid-id-value")).toThrow(
            "Id inválido. O valor não pode ser vazio ou inválido."
        );
    });

    it("deve passar na validação de id válido", () => {
        const id = new Id();

        expect(id["ehValido"](id.valor)).toBe(true);
    }); 

    it("deve retornar o valor do id como string", () => {
        const id = new Id();

        const valor = id.valor.toString();

        expect(id.valor.toString()).toBe(valor);
    });
});