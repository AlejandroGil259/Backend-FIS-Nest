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
import { CreateNovedadesDto } from './dto/create-novedades.dto';
import { UpdateNovedadeDto } from './dto/update-novedades.dto';
import { NovedadesService } from './novedades.service';
@ApiTags('Novedades')
@Controller('novedades')
export class NovedadesController {
  constructor(private readonly novedadesService: NovedadesService) {}
  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente la novedad en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'No se registro la novedad de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createNovedadesDto: CreateNovedadesDto) {
    return this.novedadesService.create(createNovedadesDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron estas novedades',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay novedades en la base de datos',
  })
  @Get()
  findAll() {
    return this.novedadesService.findAll();
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontró una novedad con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay novedades en la base de datos con es id',
  })
  @ApiParam({
    name: 'id',
    description: 'id de la novedad registrado',
    example: 123456789,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.novedadesService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado la novedad',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la DB para esta novedad',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNovedadeDto: UpdateNovedadeDto,
  ) {
    return this.novedadesService.update(id, updateNovedadeDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado la novedad',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.novedadesService.remove(id);
  }
}
