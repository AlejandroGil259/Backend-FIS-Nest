import { Module } from '@nestjs/common';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuarios.entity';
import { Estudiante } from './entities/estudiante.entity';

@Module( {
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature( [
            Usuario, Estudiante
        ] )
    ],
    providers: [ UsuariosService ],
    controllers: [ UsuariosController ],
} )
export class UsuariosModule { }
