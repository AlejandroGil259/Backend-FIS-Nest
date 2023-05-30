import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBExceptionService } from 'src/commons/services/db-exception.service';
import { Repository } from 'typeorm';
import { CreateNovedadesDto } from './dto/create-novedades.dto';
import { UpdateNovedadeDto } from './dto/update-novedades.dto';
import { Novedad } from './entities/novedad.entity';

@Injectable()
export class NovedadesService {
  constructor(
    @InjectRepository(Novedad)
    private readonly novedadRepo: Repository<Novedad>,
  ) {}
  async create(createNovedadDto: CreateNovedadesDto) {
    try {
      const novelty = await this.novedadRepo.save(createNovedadDto);
      return {
        novedad: novelty,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const novedades = await this.novedadRepo.find();

    if (!novedades || novedades.length)
      throw new NotFoundException('No se encontraron resultados');

    return novedades;
  }

  async findOne(id: string) {
    const novedad = await this.novedadRepo.findOneBy({ id });

    if (!novedad)
      throw new NotFoundException(
        `No se encontraron resultados para la novedad "${id}"`,
      );

    return novedad;
  }

  async update(id: string, updateNovedadeDto: UpdateNovedadeDto) {
    const novedad = await this.novedadRepo.findOneBy({ id });
    if (!novedad)
      return new NotFoundException(
        `No se encontró ninguna novedad con el Id ${id}`,
      );

    try {
      return await this.novedadRepo.update({ id }, { ...updateNovedadeDto });
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }
}
