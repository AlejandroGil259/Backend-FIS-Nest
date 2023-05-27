import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente el proyecto en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'No se registro el proyecto de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.createProject(createProyectoDto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontraron proyectos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay proyectos en la base de datos',
  })
  @Get()
  findAll() {
    return this.proyectosService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró un proyecto con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay proyectos en la base de datos con es id',
  })
  @ApiParam({
    name: 'id_proyecto',
    description: 'id del proyecto registrado',
    example: 123456789,
  })
  @Get(':id_proyecto')
  findOne(@Param('id_proyecto') idProyecto: string) {
    return this.proyectosService.findOne(idProyecto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    return this.proyectosService.update(+id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectosService.remove(+id);
  }
}
