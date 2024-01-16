import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  ParseIntPipe,
  ForbiddenException,
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
  async crearProyecto(@Body() createProyectoDto: CreateProyectoDto) {
    const usuarioDocumento = createProyectoDto.usuarioDocumento;

    try {
      const nuevoProyecto = await this.proyectosService.crearProyecto(
        createProyectoDto,
        usuarioDocumento,
      );
      return {
        message: 'Proyecto creado exitosamente',
        proyecto: nuevoProyecto,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/director/:documentoDirector')
  async obtenerProyectosPorDirector(
    @Param('documentoDirector', ParseIntPipe) documentoDirector: number,
  ) {
    try {
      const proyectos =
        await this.proyectosService.obtenerProyectosYEntregasPorDirector(
          documentoDirector,
        );
      return proyectos;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException(
        'No tienes permisos para acceder a estos proyectos.',
      );
    }
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
  findAllWithUserDetails() {
    return this.proyectosService.findAllWithUserDetails();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron las siguientes opciones de grado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay opciones de grado en la base de datos',
  })
  @Get('cargar/:opcionGrado')
  getOpcionGrado() {
    return this.proyectosService.getOpcionGrado();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron los estados',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay estados de respuesta en la base de datos',
  })
  @Get('estados')
  obtenerEstadosProyectos(): string[] {
    return this.proyectosService.obtenerEstadosProyectos();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron los siguientes proyectos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay proyectos en la base de datos para ese usuario',
  })
  @Get('por-documento/:documento')
  async getProjectByDocument(
    @Param('documento', ParseIntPipe) documento: number,
  ) {
    const proyecto = await this.proyectosService.getProjectsByUserDocument(
      documento,
    );
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return proyecto;
  }

  @Get('director/:documentoDirector')
  obtenerProyectosPorDocente(@Param('docenteId') docenteId: number) {
    const proyectos =
      this.proyectosService.obtenerProyectosPorDocente(docenteId);
    return { proyectos };
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
    name: 'idProyecto',
    description: 'id del proyecto registrado',
    example: '1e63d902-b3f0-406c-9a37-d46eece2e016',
  })
  @Get(':idProyecto')
  findOne(@Param('idProyecto', ParseUUIDPipe) idProyecto: string) {
    return this.proyectosService.findOne(idProyecto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el proyecto',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay proyectos en la base de datos para este usuario',
  })
  @Patch(':idProyecto')
  update(
    @Param('idProyecto', ParseUUIDPipe) idProyecto: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    return this.proyectosService.update(idProyecto, updateProyectoDto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado el proyecto',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se pudo eliminar el proyecto por que ya se encuentra inactivo o por error en la consulta',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Delete('desactivar/:id_proyecto')
  deactivate(@Param('id_proyecto', ParseUUIDPipe) idProyecto: string) {
    return this.proyectosService.desactivate(idProyecto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha restaurado el proyecto',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se pudo restaurar el proyecto por que ya se encuentra activo o por error en la consulta',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Patch('restore/:id_proyecto')
  restore(@Param('id_proyecto', ParseUUIDPipe) idProyecto: string) {
    return this.proyectosService.restore(idProyecto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado el proyecto',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro el proyectos en la base de datos',
  })
  @Delete(':idProyecto')
  remove(@Param('idProyecto', ParseUUIDPipe) idProyecto: string) {
    return this.proyectosService.remove(idProyecto);
  }
}
