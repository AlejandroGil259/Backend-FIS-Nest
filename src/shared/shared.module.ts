// shared.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { Entregas } from '../entregas/entities/entregas.entity';
import { Archivo } from '../archivos/entities/archivo.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';
import { ArchivosService } from '../archivos/archivos.service';
import { EntregasService } from '../entregas/entregas.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { ProyectosService } from '../proyectos/proyectos.service';
import { AuthService } from '../auth/services/auth.service';
import { AuthModule } from '../auth/auth.module';
import { CorreoService } from 'src/auth/services/correo.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, Entregas, Archivo, Solicitud]),
    AuthModule,
  ],
  providers: [
    EntregasService,
    ProyectosService,
    ArchivosService,
    SolicitudesService,
    AuthService,
    CorreoService,
  ],
  exports: [
    TypeOrmModule,
    EntregasService,
    ProyectosService,
    ArchivosService,
    SolicitudesService,
    AuthService,
    CorreoService,
  ],
})
export class SharedModule {}
