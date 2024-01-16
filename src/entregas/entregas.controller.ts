import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregasDto } from './dto/create-entregas.dto';
import { UpdateEntregasDto } from './dto/update-entregas.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Entregas')
@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente la entrega en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'No se registro la entrega de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  async crearEntrega(@Body() createEntregaDto: CreateEntregasDto) {
    return this.entregasService.crearEntrega(createEntregaDto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontraron las siguientes entregas',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay entregas en la base de datos',
  })
  @Get()
  findAll() {
    return this.entregasService.findAll();
  }
  
  @Get('/proyectos-evaluador/:evaluadorId')
  async getProyectosByEvaluador(@Param('evaluadorId') evaluadorId: number) {
    const proyectos = await this.entregasService.getProyectosByEvaluador(
      evaluadorId,
    );
    return { proyectos };
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontró una entrega con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay entregas en la base de datos con es id',
  })
  @ApiParam({
    name: 'idEntrega',
    description: 'id de la entrega registrada',
    example: '1e63d902-b3f0-406c-9a37-d46eece2e016',
  })
  @Get(':idEntrega')
  findOne(@Param('idEntrega') idEntrega: string) {
    return this.entregasService.findOne(idEntrega);
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontraron los siguientes tipos de entrega',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay tipo de entregas en la base de datos',
  })
  @Get('tipo/:entrega')
  getTipoEntrega() {
    return this.entregasService.getTipoEntrega();
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado la entrega',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay entregas en la base de datos para este usuario',
  })
  @Patch(':idEntrega')
  update(
    @Param('idEntrega', ParseUUIDPipe) idEntrega: string,
    @Body() updateEntregasDto: UpdateEntregasDto,
  ) {
    return this.entregasService.update(idEntrega, updateEntregasDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado la entrega',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro la entrega en la base de datos',
  })
  @Delete(':idEntrega')
  remove(@Param('idEntrega') idEntrega: string) {
    return this.entregasService.remove(idEntrega);
  }
}
