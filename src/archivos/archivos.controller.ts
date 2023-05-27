import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Archivos')
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente el archivo en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo de manera correcta la petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post()
  create(@Body() createArchivoDto: CreateArchivoDto) {
    return this.archivosService.createFile(createArchivoDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron los documentos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay documentos en la base de datos',
  })
  @Get()
  findAll() {
    return this.archivosService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró un archivo con el id ingresado ',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para ese archivo',
  })
  @ApiParam({
    name: 'id',
    description: 'Id del archivo registrado',
    example: 1234567,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivoDto: UpdateArchivoDto) {
    return this.archivosService.update(+id, updateArchivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivosService.remove(+id);
  }
}
