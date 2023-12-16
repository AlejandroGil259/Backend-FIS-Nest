import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { isUUID } from 'class-validator';

@ApiTags('Archivos')
@Controller('archivos')
export class ArchivosController {
  constructor(
    private readonly archivosService: ArchivosService,
    private readonly configService: ConfigService,
  ) {}
  @ApiResponse({
    status: 201,
    description:
      'Se creo correctamente el archivo de entregas en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo de manera correcta la petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post(':idEntrega')
  @UseInterceptors(
    FileInterceptor('archivo', {
      fileFilter: filtrarArchivo,
      storage: diskStorage({
        destination: './static/proyectos',
        filename: nombreArchivo,
      }),
    }),
  )
  async uploadProject(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('idEntrega') idEntrega: string,
  ) {
    if (!idEntrega) {
      throw new BadRequestException(
        'El campo idEntrega es requerido en los parámetros de la URL.',
      );
    }

    if (!archivo) {
      throw new BadRequestException(
        'Asegúrate de que sea un archivo Word (.docx), un archivo PDF (.pdf), o .zip',
      );
    }

    const isValidUUID = isUUID(idEntrega);
    if (!isValidUUID) {
      throw new BadRequestException(
        'El ID de entrega proporcionado no es válido.',
      );
    }

    // Servicio para guardar el archivo en la base de datos
    const createArchivoDto = new CreateArchivoDto({
      nombreArchivoServidor: archivo.filename,
      nombreArchivoOriginal: archivo.originalname,
      idEntrega: idEntrega,
      // o
      //idSolicitud: 'IdSolicitud',
    });

    try {
      await this.archivosService.crearArchivo(idEntrega, createArchivoDto);
      return {
        secureUrl: `${this.configService.get('HOST_API')}/archivos/proyecto/${
          archivo.filename
        }`,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'No se pudo guardar el archivo en la base de datos.',
      );
    }
  }

  @ApiResponse({
    status: 201,
    description:
      'Se creo correctamente el archivo de entregas en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo de manera correcta la petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post('solicitudes')
  @UseInterceptors(
    FileInterceptor('archivo', {
      fileFilter: filtrarArchivo,
      storage: diskStorage({
        destination: './static/solicitudes',
        filename: nombreArchivo,
      }),
    }),
  )
  async uploadSolicitud(
    @UploadedFile() archivo: Express.Multer.File,
    @Body('idSolicitud') idSolicitud: string, // El idSolicitud debe ir en el cuerpo de la solicitud
  ) {
    if (!idSolicitud) {
      throw new BadRequestException(
        'El campo idSolicitud es requerido en el cuerpo de la solicitud.',
      );
    }

    if (!archivo) {
      throw new BadRequestException(
        'Asegúrate de que sea un archivo Word (.docx), un archivo PDF (.pdf), o .zip',
      );
    }

    // Servicio para guardar el archivo en la base de datos
    const createArchivoDto = new CreateArchivoDto({
      nombreArchivoServidor: archivo.filename,
      nombreArchivoOriginal: archivo.originalname,
      idSolicitud: idSolicitud,
    });

    try {
      await this.archivosService.crearArchivoSolicitud(createArchivoDto);
      return {
        secureUrl: `${this.configService.get(
          'HOST_API',
        )}/archivos/solicitudes/${archivo.filename}`,
      };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo encontrar el id para guardar el archivo en la base de datos.',
      );
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron todos los archivos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay archivos en la base de datos',
  })
  @Get()
  findAll() {
    return this.archivosService.findAll();
  }
  @ApiResponse({
    status: 200,
    description: 'Se encontraron los archivos en la carpeta de proyectos',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay archivos en la base de datos',
  })
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
  @Get('solicitud/:id')
  findOneSolicitud(@Res() res: Response, @Param('id') id: string) {
    const path = this.archivosService.getStaticSolicitud(id);

    res.sendFile(path);
  }

  @Get(':id')
  async getArchivoById(@Param('id') id: string) {
    const archivo = await this.archivosService.getArchivoById(id);
    return archivo;
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el archivo',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos de este archivo',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivoDto: UpdateArchivoDto) {
    return this.archivosService.update(id, updateArchivoDto);
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
