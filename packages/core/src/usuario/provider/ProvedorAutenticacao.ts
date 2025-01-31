export default interface ProvedorAutenticacao {
  autenticarComProvedor(
    provedor: string,
    token: string
  ): Promise<{ email: string; nome: string; foto: string }>;
}
