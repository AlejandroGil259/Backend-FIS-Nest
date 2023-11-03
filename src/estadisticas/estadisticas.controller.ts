import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estadisticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('total-proyectos-por-tipo')
  getTotalProyectosPorTipo() {
    return this.estadisticasService.getTotalProyectosPorTipo();
  }

  @Get('proyectos-por-director')
  getProyectosPorDirector() {
    return this.estadisticasService.getProyectosPorDirector();
  }

  @Get('proyectos-finalizados-por-ano/:ano')
  getProyectosFinalizadosPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.estadisticasService.getProyectosFinalizadosPorAno(ano);
  }
}
