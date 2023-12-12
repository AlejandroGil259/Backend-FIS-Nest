import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estadisticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('total-proyectos-por-opcion')
  getTotalProyectosPorTipo() {
    return this.estadisticasService.getTotalProyectosPorTipo();
  }

  // @Get('proyectos-por-director')
  // getProyectosPorDirector() {
  //   return this.estadisticasService.getProyectosPorDirector();
  // }

  @Get('proyectos-finalizados')
  getProyectosFinalizadosPorAno() {
    return this.estadisticasService.getProyectosFinalizadosPorAno();
  }

  @Get('proyectos-activos')
  getProyectosExcluyendoEstados() {
    return this.estadisticasService.getProyectosExcluyendoEstados();
  }
}
