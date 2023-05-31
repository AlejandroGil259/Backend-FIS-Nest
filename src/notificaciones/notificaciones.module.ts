import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ Notificacion ] ),
        UsuariosModule
    ],
    controllers: [ NotificacionesController ],
    providers: [ NotificacionesService ],
    exports: [ TypeOrmModule ]
} )
export class NotificacionesModule { }
