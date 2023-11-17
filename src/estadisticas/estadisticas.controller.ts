import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get('proyectos-por-director')
  getProyectosPorDirector() {
    return this.estadisticasService.getProyectosPorDirector();
  }

  @Get('proyectos-finalizados/:ano')
  getProyectosFinalizadosPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.estadisticasService.getProyectosFinalizadosPorAno(ano);
  }

  @Get('proyectos-excluyendo-estados')
  getProyectosExcluyendoEstados() {
    return this.estadisticasService.getProyectosExcluyendoEstados();
  }
}
