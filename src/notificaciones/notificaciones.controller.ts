import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { UpdateNotificacioneDto } from './dto/update-notificaciones.dto';
import { NotificacionesService } from './notificaciones.service';
@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}
  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente la notificación en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'No se registro la notificacion de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createNotificacionesDto: CreateNotificacionesDto) {
    return this.notificacionesService.create(createNotificacionesDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron notificaciones',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay notificaciones en la base de datos',
  })
  @Get()
  findAll() {
    return this.notificacionesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró una notificacion con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay notificaciones en la base de datos con es id',
  })
  @ApiParam({
    name: 'id',
    description: 'id de la notificación registrada',
    example: 123456789,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacionesService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado la notificación',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para la notificación',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificacioneDto: UpdateNotificacioneDto,
  ) {
    return this.notificacionesService.update(id, updateNotificacioneDto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado la notificacion',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay notificaciones en la base de datos',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacionesService.remove(id);
  }
}
