import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ProvedorCriptografia } from '@s3curity/core';

@Injectable()
export class BcryptProvider implements ProvedorCriptografia {
  private readonly saltRounds = 10;

  async criptografar(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, this.saltRounds);
    return hash;
  }

  async comparar(senha: string, senhaCriptografada: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(senha, senhaCriptografada);
    return isMatch;
  }
}
