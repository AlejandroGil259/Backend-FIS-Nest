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

  async createFile(createArchivoDto: CreateArchivoDto) {
    try {
      const file = await this.archivoRepo.save(createArchivoDto);

      return {
        archivo: file,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const archivos = await this.archivoRepo.find();

    if (!archivos || !archivos.length)
      throw new NotFoundException('No se encontraron resultados');

    return archivos;
  }

  async findOne(id: string) {
    const archivo = await this.archivoRepo.findOne({
      where: { id },
      relations: { solicitud: true, proyectos: true },
    });

    if (!archivo)
      throw new NotFoundException(
        `No se encontraron resultados para el archivo "${id}"`,
      );

    return archivo;
  }

  // async update(id: string, updateArchivoDto: UpdateArchivoDto) {
  //   const archivo = await this.archivoRepo.findOneBy({ id });
  //   if (!archivo)
  //     return new NotFoundException(
  //       `No se encontró ningun archivo con el Id ${id}`,
  //     );

  //   try {
  //     return await this.archivoRepo.update({ id }, { ...updateArchivoDto });
  //   } catch (error) {
  //     throw DBExceptionService.handleDBException(error);
  //   }
  // }

  async updateArchivo(id: string, newExtension: string, newName: string) {
    const archivo = await this.archivoRepo.findOne({ where: { id: id } }); // Usar un objeto de opciones

    if (!archivo) {
      return null; // Retorna null si el archivo no se encuentra
    }

    // Realiza las modificaciones necesarias en el archivo
    archivo.extensionArchivo = newExtension;
    archivo.nombreArchivo = newName;

    try {
      await this.archivoRepo.save(archivo); // Guarda el archivo actualizado en la base de datos
      return archivo; // Retorna el archivo actualizado
    } catch (error) {
      console.error(error);
      // Maneja errores de guardado en la base de datos
      throw new Error(
        'Error al guardar el archivo actualizado en la base de datos.',
      );
    }
  }

  async remove(id: string) {
    const archivo = await this.archivoRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!archivo)
      throw new NotFoundException(`El archivo no existe con el id ${id}`);
    return await this.archivoRepo.remove(archivo);
  }
}
