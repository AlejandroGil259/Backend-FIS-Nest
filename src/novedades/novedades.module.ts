import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Novedad } from './entities/novedad.entity';
import { NovedadesController } from './novedades.controller';
import { NovedadesService } from './novedades.service';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ Novedad ] ),
        NotificacionesModule,
        UsuariosModule
    ],
    controllers: [ NovedadesController ],
    providers: [ NovedadesService ],
} )
export class NovedadesModule { }
