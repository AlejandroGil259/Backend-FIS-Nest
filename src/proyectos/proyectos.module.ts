import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto]), AuthModule],
  controllers: [ProyectosController],
  providers: [ProyectosService],

  exports: [TypeOrmModule],
})
export class ProyectosModule {}
