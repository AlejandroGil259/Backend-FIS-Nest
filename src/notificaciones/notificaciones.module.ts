import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion]), AuthModule],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [TypeOrmModule],
})
export class NotificacionesModule {}
