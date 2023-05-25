import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosModule } from './proyectos/proyectos.module';
import { ArchivosModule } from './archivos/archivos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

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
            synchronize: true
        } ),

        UsuariosModule,

        ProyectosModule,

        ArchivosModule,

        SolicitudesModule,
    ],
} )
export class AppModule { }
