import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ProvedorCriptografia } from '@s3curity/core';

@Injectable()
export class BcryptProvider implements ProvedorCriptografia {
  async criptografar(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    return hash;
  }

  async comparar(senha: string, senhaCriptografada: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(senha, senhaCriptografada);

    return isMatch;
  }
}
