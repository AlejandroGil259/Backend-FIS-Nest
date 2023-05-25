import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';

@ApiTags( 'Usuarios' )
@Controller( 'usuarios' )
export class UsuariosController {
    constructor ( private readonly usuariosService: UsuariosService ) { }

    @Get()
    getHello () {
        return this.usuariosService.getHello();
    }
}
