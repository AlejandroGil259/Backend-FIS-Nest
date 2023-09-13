import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSolicitudesDto } from './dto/create-solicitudes.dto';
import { UpdateSolicitudesDto } from './dto/update-solicitudes.dto';
import { SolicitudesService } from './solicitudes.service';
@ApiTags('Solicitudes')
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}
  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente la solicitud en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo la solicitud de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createSolicitudeDto: CreateSolicitudesDto) {
    return this.solicitudesService.create(createSolicitudeDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron solicitudes',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay solicitudes en la base de datos',
  })
  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró una solicitud con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para esta solicitud',
  })
  @ApiParam({
    name: 'idSolicitud',
    description: 'id de la solicitud registrada',
    example: 123456789,
  })
  @Get(':idSolicitud')
  findOne(@Param('idSolicitud', ParseUUIDPipe) idSolicitud: string) {
    return this.solicitudesService.findOne(idSolicitud);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado su solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para esta solicitud',
  })
  @Patch(':idSolicitud')
  update(
    @Param('idSolicitud', ParseUUIDPipe) idSolicitud: string,
    @Body() updateSolicitudeDto: UpdateSolicitudesDto,
  ) {
    return this.solicitudesService.update(idSolicitud, updateSolicitudeDto);
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay solicitudes en la base de datos',
  })
  @Delete(':idSolicitud')
  remove(@Param('idSolicitud', ParseUUIDPipe) idSolicitud: string) {
    return this.solicitudesService.remove(idSolicitud);
  }
}
