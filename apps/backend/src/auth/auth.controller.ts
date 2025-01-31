import { Body, Controller, Post, Put, Get, Param, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Usuario } from '@s3curity/core';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dados: { email: string; senha: string },
    @Ip() ip: string,
  ) {
    return this.authService.login(dados.email, dados.senha, ip);
  }

  @Post('registrar')
  async registrar(@Body() usuario: Usuario) {
    return this.authService.registrar(usuario);
  }

  @Put('solicitar-recuperacao')
  async solicitarRecuperacao(@Body() dados: { email: string }) {
    return this.authService.solicitarRecuperacao(dados.email);
  }

  @Get('verificar-token/:token')
  async verificarTokenRecuperacao(@Param('token') token: string) {
    return this.authService.verificarTokenRecuperacao(token);
  }

  @Put('recuperar-senha')
  async recuperarSenha(
    @Body() dados: { token: string; novaSenha: string; confirmarSenha: string },
  ) {
    return this.authService.recuperarSenha(
      dados.token,
      dados.novaSenha,
      dados.confirmarSenha,
    );
  }

  @Post('gerar-qr-code')
  async gerarQrCode(@Body() dados: { email: string }) {
    return this.authService.gerarQrCode(dados.email);
  }

  @Post('login-token')
  async loginQr(@Body() dados: { token: string }) {
    return this.authService.verificarTokenLogin(dados.token);
  }

  @Post('login/provedor')
  async loginComGoogle(@Body() dados: { token: string; provedor: string }) {
    return this.authService.loginComGoogle(dados.token, dados.provedor);
  }

  @Get('verificar-login/:token')
  async verificarLogin(@Param('token') token: string) {
    return this.authService.verificarTokenLogin(token);
  }
}
