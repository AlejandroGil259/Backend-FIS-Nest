import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitudes } from './entities/solicitudes.entity';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [
            Solicitudes
        ] )
    ],
    controllers: [ SolicitudesController ],
    providers: [ SolicitudesService ]
} )
export class SolicitudesModule { }
