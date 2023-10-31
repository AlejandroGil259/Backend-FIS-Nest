import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { ArchivosService } from './archivos.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { filtrarArchivo, nombreArchivo } from './helpers';

@ApiTags('Archivos')
@Controller('archivos')
export class ArchivosController {
  constructor(
    private readonly archivosService: ArchivosService,
    private readonly configService: ConfigService,
  ) {}

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
  @Post('proyecto')
  @UseInterceptors(
    FileInterceptor('archivo', {
      fileFilter: filtrarArchivo,
      // limits:{fileSize: 1000}
      storage: diskStorage({
        destination: './static/proyectos',
        filename: nombreArchivo,
      }),
    }),
  )
  uploadProject(@UploadedFile() archivo: Express.Multer.File) {
    if (!archivo) {
      throw new BadRequestException(
        'Asegúrate de que sea un archivo Word (.docx) o un archivo PDF (.pdf).',
      );
    }

    // const secureUrl = `${archivo.filename}`;
    const secureUrl = `${this.configService.get(
      'HOST_API',
    )}/archivos/proyecto/${archivo.filename}`;

    return {
      secureUrl,
    };
  }

  create(@Body() createArchivoDto: CreateArchivoDto) {
    return this.archivosService.createFile(createArchivoDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron los archivos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay archivos en la base de datos',
  })
  // @Get()
  // findAll() {
  //   return this.archivosService.findAll();
  // }
  @Get('pdf-y-docx')
  async getArchivosPdfDocx(@Res() res: Response) {
    const archivos = await this.archivosService.getArchivosPdfDocx();
    res.json(archivos);
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
    example: 'b86d465f-4726-4068-80e8-26173238647f',
  })
  @Get('proyecto/:id')
  findOne(@Res() res: Response, @Param('id') id: string) {
    const path = this.archivosService.getStaticProyecto(id);

    res.sendFile(path);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el archivo',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos de este archivo',
  })
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArchivoDto: UpdateArchivoDto) {
  //   return this.archivosService.update(id, updateArchivoDto);
  // }
  @Patch(':id')
  async updateFile(
    @Param('id') id: string,
    @Body() updateArchivoDto: UpdateArchivoDto, // Asegúrate de proporcionar el DTO
    @Res() res: Response,
  ) {
    try {
      const updatedFile = await this.archivosService.updateArchivo(
        id,
        updateArchivoDto.extensionArchivo, // Pasar la nueva extensión
        updateArchivoDto.nombreArchivo, // Pasar el nuevo nombre
      );

      if (!updatedFile) {
        throw new NotFoundException('Archivo no encontrado.');
      }

      res.json(updatedFile);
    } catch (error) {
      console.error(error);
      // Manejar otros errores aquí
      res
        .status(500)
        .json({ message: 'Ocurrió un error al actualizar el archivo.' });
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado el archivo',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay archivos en la base de datos',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivosService.remove(id);
  }
}
