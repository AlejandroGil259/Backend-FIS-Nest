import {
  BadRequestException,
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
import { filtrarArchivo, nombreArchivo } from './helpers';
import { isUUID } from 'class-validator';
import * as fs from 'fs';

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
  @Post('solicitudes/:idSolicitud')
  @UseInterceptors(
    FileInterceptor('archivoSolicitud', {
      fileFilter: filtrarArchivo,
      storage: diskStorage({
        destination: './static/solicitudes',
        filename: nombreArchivo,
      }),
    }),
  )
  async uploadSolicitud(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('idSolicitud') idSolicitud: string,
  ) {
    if (!idSolicitud) {
      throw new BadRequestException(
        'El campo idSolicitud es requerido en los parámetros de la URL.',
      );
    }

    if (!archivo) {
      throw new BadRequestException(
        'Asegúrate de que sea un archivo Word (.docx), un archivo PDF (.pdf), o .zip',
      );
    }

    // Servicio para guardar el archivo en la base de datos
    const createArchivoDto = new CreateArchivoDto({
      nombreArchivoOriginal: archivo.originalname,
      nombreArchivoServidor: archivo.filename,
      idSolicitud: idSolicitud,
    });

    try {
      await this.archivosService.crearArchivoSolicitud(
        idSolicitud,
        createArchivoDto,
      );
      return {
        secureUrl: `${this.configService.get('HOST_API')}/archivos/solicitud/${
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
  // @Get('pdf-y-docx')
  // async getArchivosPdfDocx(@Res() res: Response) {
  //   const archivos = await this.archivosService.getArchivosPdfDocx();
  //   res.json(archivos);
  // }
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
    const archivo = await this.archivosService.findById(id);
    return archivo;
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el archivo',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay archivos en la base de datos',
  })
  @Patch('actualizar/solicitud/:idArchivo')
  @UseInterceptors(
    FileInterceptor('archivoSolicitud', {
      fileFilter: filtrarArchivo,
      storage: diskStorage({
        destination: './static/solicitudes',
        filename: nombreArchivo,
      }),
    }),
  )
  async actualizarArchivoSolicitud(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('idArchivo') idArchivo: string,
  ) {
    try {
      if (!idArchivo) {
        throw new BadRequestException(
          'El campo idArchivo es requerido en los parámetros de la URL.',
        );
      }

      if (!archivo) {
        throw new BadRequestException(
          'Asegúrate de que sea un archivo Word (.docx), un archivo PDF (.pdf), o .zip',
        );
      }

      const isValidUUID = isUUID(idArchivo);
      if (!isValidUUID) {
        throw new NotFoundException(
          `El ID Archivo proporcionado no es válido ID: ${idArchivo}`,
        );
      }

      const updateArchivoDto = {
        nombreArchivoOriginal: archivo.originalname,
        nombreArchivoServidor: archivo.filename,
      };

      const archivoActualizado =
        await this.archivosService.actualizarArchivoSolicitud(
          idArchivo,
          updateArchivoDto,
        );

      const rutaArchivoAntiguo = `./static/solicitudes/${archivoActualizado.nombreArchivoServidor}`;
      const rutaNuevoArchivo = `./static/solicitudes/${archivo.filename}`;

      // fs.promises para copiar o reemplazar el archivo
      await fs.promises.copyFile(rutaNuevoArchivo, rutaArchivoAntiguo);
      //await fs.promises.unlink(rutaNuevoArchivo); // Opcional: Eliminar el archivo antiguo

      return {
        secureUrl: `${this.configService.get('HOST_API')}/archivos/solicitud/${
          archivoActualizado.nombreArchivoServidor
        }`,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'No se pudo actualizar el archivo en la base de datos.',
      );
    }
  }

  @Patch('actualizarEntrega/:idArchivo')
  @UseInterceptors(
    FileInterceptor('archivo', {
      fileFilter: filtrarArchivo,
      storage: diskStorage({
        destination: './static/proyectos',
        filename: nombreArchivo,
      }),
    }),
  )
  async actualizarArchivoEntrega(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('idArchivo') idArchivo: string,
  ) {
    try {
      if (!idArchivo) {
        throw new BadRequestException(
          'El campo idArchivo es requerido en los parámetros de la URL.',
        );
      }

      if (!archivo) {
        throw new BadRequestException(
          'Asegúrate de que sea un archivo Word (.docx), un archivo PDF (.pdf), o .zip',
        );
      }

      const isValidUUID = isUUID(idArchivo);
      if (!isValidUUID) {
        throw new NotFoundException(
          `El ID Archivo proporcionado no es válido ID: ${idArchivo}`,
        );
      }

      const updateArchivoDto = {
        nombreArchivoOriginal: archivo.originalname,
        nombreArchivoServidor: archivo.filename,
      };

      const archivoActualizado =
        await this.archivosService.actualizarArchivoEntrega(
          idArchivo,
          updateArchivoDto,
        );

      const rutaArchivoAntiguo = `./static/proyectos/${archivoActualizado.nombreArchivoServidor}`;
      const rutaNuevoArchivo = `./static/proyectos/${archivo.filename}`;

      await fs.promises.copyFile(rutaNuevoArchivo, rutaArchivoAntiguo);

      return {
        secureUrl: `${this.configService.get('HOST_API')}/archivos/proyecto/${
          archivoActualizado.nombreArchivoServidor
        }`,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'No se pudo actualizar el archivo Entregas en la base de datos.',
      );
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
