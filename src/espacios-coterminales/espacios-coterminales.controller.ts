import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { EspaciosCoterminalesService } from './espacios-coterminales.service';
import { CreateEspaciosCoterminaleDto } from './dto/create-espacios-coterminale.dto';
import { UpdateEspaciosCoterminaleDto } from './dto/update-espacios-coterminale.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Espacios Coterminales')
@Controller('espacios-coterminales')
export class EspaciosCoterminalesController {
  constructor(
    private readonly espaciosCoterminalesService: EspaciosCoterminalesService,
  ) {}
  @ApiResponse({
    status: 201,
    description:
      'Se creo correctamente la opcion de grado espacio coterminal en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description:
      'El usuario no realizo el registro de opcion de grado espacio coterminal de manera correcta',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createEspaciosCoterminaleDto: CreateEspaciosCoterminaleDto) {
    return this.espaciosCoterminalesService.create(
      createEspaciosCoterminaleDto,
    );
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontro la opcion de grado espacio coterminal',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay espacios coterminales en la base de datos',
  })
  @Get()
  findAll() {
    return this.espaciosCoterminalesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró el espacio coterminal con el id ingresado',
  })
  @ApiResponse({
    status: 404,
    description:
      'No hay opcion de grado en la base de datos con espacio coterminal',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.espaciosCoterminalesService.findOne(+id);
  }
  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el espacio coterminal',
  })
  @ApiResponse({
    status: 404,
    description:
      'No hay registros en la base de datos para ese espacio coterminal',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEspaciosCoterminaleDto: UpdateEspaciosCoterminaleDto,
  ) {
    return this.espaciosCoterminalesService.update(
      +id,
      updateEspaciosCoterminaleDto,
    );
  }
}
