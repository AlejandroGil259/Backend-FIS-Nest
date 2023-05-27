import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ArchivosModule } from './archivos/archivos.module';
import { JoiValidationSchema } from './config';
import { ProyectosModule } from './proyectos/proyectos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { NovedadesModule } from './novedades/novedades.module';

@Module( {
    imports: [
        // Aplicar la validación y reconocer las variables de entorno
        ConfigModule.forRoot( {
            validationSchema: JoiValidationSchema
        } ),

        // Conexión a la base de datos
        TypeOrmModule.forRoot( {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number( process.env.DB_PORT ),
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            autoLoadEntities: true,
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy()
        } ),

        UsuariosModule,

        ProyectosModule,

        ArchivosModule,

        SolicitudesModule,

        NotificacionesModule,

        NovedadesModule,
    ],
} )
export class AppModule { }
