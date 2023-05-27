import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DBExceptionService } from '../commons/services/db-exception.service';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private readonly archivoRepo: Repository<Archivo>,
  ) {}

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
    const archivo = await this.archivoRepo.findOneBy({ id });

    if (!archivo)
      throw new NotFoundException(
        `No se encontraron resultados para el documento "${id}"`,
      );

    return archivo;
  }

  update(id: number, updateArchivoDto: UpdateArchivoDto) {
    return `This action updates a #${id} archivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} archivo`;
  }
}
