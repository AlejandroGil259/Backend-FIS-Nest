import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';

@Module({
  imports:[Proyecto],
  controllers: [ProyectosController],
  providers: [ProyectosService]
})
export class ProyectosModule {}
