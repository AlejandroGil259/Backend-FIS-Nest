import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('say-hello')
  getHello(): string {
    return this.usuariosService.getHello();
  }
}
