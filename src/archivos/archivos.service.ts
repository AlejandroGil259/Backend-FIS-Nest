import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../commons/services/db-exception.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import * as fs from 'fs';
import { EntregasService } from '../entregas/entregas.service';
import { SolicitudesService } from 'src/solicitudes/solicitudes.service';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private readonly archivosRepo: Repository<Archivo>,
    private readonly entregasService: EntregasService,
    private readonly solicitudesService: SolicitudesService,
  ) {}

  getStaticProyecto(nombreProyecto: string) {
    const path = join(__dirname, '../../static/proyectos', nombreProyecto);
    if (!existsSync(path))
      throw new BadRequestException(
        `No se encontro ningun archivo ${nombreProyecto}`,
      );
    return path;
  }

  getStaticSolicitud(nombreSolicitud: string) {
    const path = join(__dirname, '../../static/solicitudes', nombreSolicitud);
    if (!existsSync(path))
      throw new BadRequestException(
        `No se encontro ningun archivo ${nombreSolicitud}`,
      );
    return path;
  }

  getArchivosPdfDocx() {
    const rutaCarpetaArchivos = join(__dirname, '../../static/proyectos');
    const archivos = fs.readdirSync(rutaCarpetaArchivos);
    const archivosFiltrados = archivos.filter(
      (archivo) => archivo.endsWith('.pdf') || archivo.endsWith('.docx'),
    );

    if (archivosFiltrados.length === 0) {
      throw new NotFoundException('No se encontraron archivos PDF o DOCX.');
    }

    return archivosFiltrados;
  }

  async crearArchivo(createArchivoDto: CreateArchivoDto): Promise<Archivo> {
    const { idEntrega, ...restoDto } = createArchivoDto;

    // Verifica que la entrega exista
    const entrega = await this.entregasService.findOne(idEntrega);

    if (!entrega) {
      throw new NotFoundException(
        `No se encontró la entrega con ID ${idEntrega}`,
      );
    }

    // Crea el archivo asociándolo a la entrega
    try {
      const archivo = this.archivosRepo.create({
        ...restoDto,
        entregas: entrega,
      });

      const nuevoArchivo = await this.archivosRepo.save(archivo);

      return nuevoArchivo;
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async crearArchivoSolicitud(
    createArchivoDto: CreateArchivoDto,
  ): Promise<Archivo> {
    const { idSolicitud, ...restoDto } = createArchivoDto;

    // Verifica que la solicitud exista
    const solicitud = await this.solicitudesService.findOne(idSolicitud);

    if (!solicitud) {
      throw new NotFoundException(
        `No se encontró la solicitud con ID ${idSolicitud}`,
      );
    }

    // Crea el archivo asociándolo a la solicitud
    try {
      const archivo = this.archivosRepo.create({
        ...restoDto,
        solicitud: solicitud,
      });

      const nuevoArchivo = await this.archivosRepo.save(archivo);

      return nuevoArchivo;
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const archivos = await this.archivosRepo.find();

    if (!archivos || !archivos.length)
      throw new NotFoundException('No se encontraron resultados');

    return archivos;
  }

  async findOne(idArchivo: string) {
    const archivo = await this.archivosRepo.findOne({
      where: { idArchivo },
      relations: { solicitud: true, entregas: true },
    });

    if (!archivo)
      throw new NotFoundException(
        `No se encontraron resultados para el archivo "${idArchivo}"`,
      );

    return archivo;
  }

  async getArchivoById(idArchivo: string): Promise<Archivo> {
    const archivo = await this.archivosRepo.findOne({ where: { idArchivo } });

    if (!archivo) {
      throw new NotFoundException(
        `No se encontró ningún archivo con el ID ${idArchivo}`,
      );
    }

    return archivo;
  }

  async update(idArchivo: string, updateArchivoDto: UpdateArchivoDto) {
    const archivo = await this.archivosRepo.findOne({ where: { idArchivo } });
    if (!archivo) {
      throw new NotFoundException(
        `No se encontró ningún archivo con el ID ${idArchivo}`,
      );
    }

    try {
      // Actualiza las propiedades del archivo con los datos proporcionados en updateArchivoDto
      this.archivosRepo.merge(archivo, updateArchivoDto);

      return await this.archivosRepo.save(archivo);
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }
  //PRUEBA PATCH1
  // async updateExtension(id: string, newExtension: string): Promise<Archivo> {
  //   const archivo = await this.archivoRepo.findOne({ where: { id } });
  //   if (!archivo) {
  //     throw new NotFoundException('Archivo no encontrado');
  //   }

  //   archivo.extensionArchivo = newExtension;
  //   return this.archivoRepo.save(archivo);
  // }

  // PRUEBA PUT 2
  // async updateArchivo(
  //   idArchivo: string,
  //   updateArchivoDto: UpdateArchivoDto,
  // ): Promise<Archivo> {
  //   // Encuentra el archivo por ID
  //   const archivo = await this.archivoRepo.findOne({
  //     where: { idArchivo: idArchivo },
  //   });

  //   if (!archivo) {
  //     // Manejar el caso en que el archivo no existe
  //     throw new Error('Archivo no encontrado');
  //   }

  //   // Aplica las actualizaciones desde el DTO
  //   archivo.filename = updateArchivoDto.filename;

  //   // Guarda el archivo actualizado en la base de datos
  //   await this.archivoRepo.save(archivo);

  //   return archivo;
  // }
  async remove(idArchivo: string) {
    const archivo = await this.archivosRepo.findOne({
      where: { idArchivo },
      withDeleted: true,
    });

    if (!archivo)
      throw new NotFoundException(
        `El archivo no existe con el id ${idArchivo}`,
      );
    return await this.archivosRepo.remove(archivo);
  }
}
