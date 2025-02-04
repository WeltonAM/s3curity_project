import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  constructor(private readonly repo: UsuarioPrisma) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new HttpException('Token não informado', 401);
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (req as any).usuario = payload;

      const usuario = await this.repo.buscarPorEmail(payload.email);
      if (!usuario) {
        throw new HttpException('Usuário não encontrado', 401);
      }

      next();
    } catch (err) {
      console.error('ERROR: ', err);

      if (err instanceof jwt.JsonWebTokenError) {
        throw new HttpException(
          'Acesso negado: Token inválido ou expirado',
          401,
        );
      }

      throw new HttpException('Erro ao processar token', 500);
    }
  }
}
