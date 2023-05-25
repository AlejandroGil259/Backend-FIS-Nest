import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
    getHello () {
        return {
            status: true,
            msg: 'Prueba desde Swagger',
            error: false
        };
    }
}
