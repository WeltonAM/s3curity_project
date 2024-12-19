export default interface ProvedorAutenticacao {
    autenticarComProvedor(provedor: string, token: string): Promise<string>;
}
