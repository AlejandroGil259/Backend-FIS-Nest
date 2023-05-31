import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [
            Proyecto
        ] ),
        UsuariosModule
    ],
    controllers: [ ProyectosController ],
    providers: [ ProyectosService ]
} )
export class ProyectosModule { }
