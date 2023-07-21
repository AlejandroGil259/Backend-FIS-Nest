import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosModule } from 'src/proyectos/proyectos.module';
import { AuthModule } from '../auth/auth.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { Novedad } from './entities/novedad.entity';
import { NovedadesController } from './novedades.controller';
import { NovedadesService } from './novedades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Novedad]),
    NotificacionesModule,
    AuthModule,
    ProyectosModule,
  ],
  controllers: [NovedadesController],
  providers: [NovedadesService]
})
export class NovedadesModule {}
