import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosProyectos } from './entities/usuarios-proyectos.entity';
import { Usuario } from './entities/usuarios.entity';
import { UsuariosService } from './services/usuarios.service';

@Module( {
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature( [
            Usuario,
            UsuariosProyectos,
        ] ),
    ],
    providers: [ UsuariosService ],
    controllers: [ UsuariosController ],
    exports: [ TypeOrmModule ]
} )
export class UsuariosModule { }
