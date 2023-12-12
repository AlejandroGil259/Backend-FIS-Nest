import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { PasantiasService } from './pasantias.service';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdatePasantiaDto } from './dto/update-pasantia.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pasantias')
@Controller('pasantias')
export class PasantiasController {
  constructor(private readonly pasantiasService: PasantiasService) {}

  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente la pasantia en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'No se registro la pasantia de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createPasantiaDto: CreatePasantiaDto) {
    return this.pasantiasService.create(createPasantiaDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron pasantias',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay pasantias en la base de datos',
  })
  @Get()
  findAll() {
    return this.pasantiasService.findAll();
  }

  @ApiResponse({
    status: 200,
    description:
      'Se encontró una pasantia con el nombre de la empresa ingresado',
  })
  @ApiResponse({
    status: 404,
    description:
      'No hay pasantia en la base de datos con es nombre de la empresa',
  })
  @Get(':idPasantia')
  findOne(@Param('idPasantia', ParseUUIDPipe) idPasantia: string) {
    return this.pasantiasService.findOne(idPasantia);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado pasantia',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para esta pasantia',
  })
  @Patch(':idPasantia')
  update(
    @Param('idPasantia') idPasantia: string,
    @Body() updatePasantiaDto: UpdatePasantiaDto,
  ) {
    return this.pasantiasService.update(idPasantia, updatePasantiaDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado la pasantia',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro la pasantia en la base de datos',
  })
  @Delete(':idPasantia')
  remove(@Param('idPasantia', ParseUUIDPipe) idProyecto: string) {
    return this.pasantiasService.remove(idProyecto);
  }
}
