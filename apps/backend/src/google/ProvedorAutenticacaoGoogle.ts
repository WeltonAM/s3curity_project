import { ProvedorAutenticacao } from '@s3curity/core';
import { OAuth2Client } from 'google-auth-library';

export default class ProvedorAutenticacaoGoogle
  implements ProvedorAutenticacao
{
  private oAuth2Client: OAuth2Client;

  constructor(clientId: string) {
    this.oAuth2Client = new OAuth2Client(clientId);
  }

  async autenticarComProvedor(
    provedor: string,
    token: string,
  ): Promise<{ email: string; nome: string; foto: string }> {
    if (provedor !== 'google') {
      throw new Error('Provedor não suportado.');
    }

    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('Erro ao extrair dados do token.');
      }

      return {
        email: payload.email,
        nome: payload.name,
        foto: payload.picture,
      };
    } catch (error) {
      throw new Error(`Erro de autenticação: ${error.message}`);
    }
  }
}
