import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { NotificacionesService } from './notificaciones.service';
import { AuthService } from '../auth/services/auth.service';

@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(
    private readonly notificacionesService: NotificacionesService,
    private readonly authService: AuthService,
  ) {}
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
    example: '4b87d547-ddc1-4e80-acdf-f1cd722f9f5',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificacionesService.findOne(id);
  }

}
