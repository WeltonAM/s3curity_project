export default interface Login {
  id?: string;
  usuario_email: string;
  sucesso: boolean;
  ip?: string;
  data_hora?: Date;
  provedor?: string;
  token?: string;
}