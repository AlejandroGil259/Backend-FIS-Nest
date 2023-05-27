import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';
import { Archivo } from './entities/archivo.entity';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [
            Archivo
        ] )
    ],
    controllers: [ ArchivosController ],
    providers: [ ArchivosService ]
} )
export class ArchivosModule { }
