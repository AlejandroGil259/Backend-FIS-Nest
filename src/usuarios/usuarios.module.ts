import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosNotificaciones } from './entities/usuarios-notificaciones.entity';
import { UsuariosProyectos } from './entities/usuarios-proyectos.entity';
import { Usuario } from './entities/usuarios.entity';
import { UsuariosService } from './services/usuarios.service';

@Module( {
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature( [
            Usuario,
            UsuariosNotificaciones,
            UsuariosProyectos,
        ] ),
    ],
    providers: [ UsuariosService ],
    controllers: [ UsuariosController ],
} )
export class UsuariosModule { }
