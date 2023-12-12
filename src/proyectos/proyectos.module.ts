// proyectos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto]), AuthModule, SharedModule],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
