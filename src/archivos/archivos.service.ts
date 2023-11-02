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

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private readonly archivoRepo: Repository<Archivo>,
  ) {}

  getStaticProyecto(nombreProyecto: string) {
    const path = join(__dirname, '../../static/proyectos', nombreProyecto);
    if (!existsSync(path))
      throw new BadRequestException(
        `No se encontro ningun archivo ${nombreProyecto}`,
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

  async createFile(createArchivoDto: CreateArchivoDto): Promise<Archivo> {
    try {
      const archivo = this.archivoRepo.create(createArchivoDto);
      return await this.archivoRepo.save(archivo);
      //const file = await this.archivoRepo.save(createArchivoDto);

      // return {
      //   archivo: file,
      // };
    } catch (error) {
      //throw DBExceptionService.handleDBException(error);
      throw new Error('No se pudo crear el archivo en la base de datos.');
    }
  }

  async findAll() {
    const archivos = await this.archivoRepo.find();

    if (!archivos || !archivos.length)
      throw new NotFoundException('No se encontraron resultados');

    return archivos;
  }

  async findOne(idArchivo: string) {
    const archivo = await this.archivoRepo.findOne({
      where: { idArchivo },
      relations: { solicitud: true, proyectos: true },
    });

    if (!archivo)
      throw new NotFoundException(
        `No se encontraron resultados para el archivo "${idArchivo}"`,
      );

    return archivo;
  }

  async update(idArchivo: string, updateArchivoDto: UpdateArchivoDto) {
    const archivo = await this.archivoRepo.findOne({ where: { idArchivo } });
    if (!archivo) {
      throw new NotFoundException(
        `No se encontró ningún archivo con el ID ${idArchivo}`,
      );
    }

    try {
      // Actualiza las propiedades del archivo con los datos proporcionados en updateArchivoDto
      this.archivoRepo.merge(archivo, updateArchivoDto);

      return await this.archivoRepo.save(archivo);
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
    const archivo = await this.archivoRepo.findOne({
      where: { idArchivo },
      withDeleted: true,
    });

    if (!archivo)
      throw new NotFoundException(
        `El archivo no existe con el id ${idArchivo}`,
      );
    return await this.archivoRepo.remove(archivo);
  }
}
