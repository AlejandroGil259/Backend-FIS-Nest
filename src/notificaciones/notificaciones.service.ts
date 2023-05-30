import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBExceptionService } from 'src/commons/services/db-exception.service';
import { Repository } from 'typeorm';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { UpdateNotificacioneDto } from './dto/update-notificaciones.dto';
import { Notificacion } from './entities/notificacion.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
  ) {}

  async create(createNotificacionDto: CreateNotificacionesDto) {
    try {
      const notification = await this.notificacionRepo.save(
        createNotificacionDto,
      );
      return {
        notificacion: notification,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const notificaciones = await this.notificacionRepo.find();

    if (!notificaciones || !notificaciones.length)
      throw new NotFoundException('No se encontraron resultados');

    return notificaciones;
  }

  async findOne(id: string) {
    const notificacion = await this.notificacionRepo.findOneBy({ id });

    if (!notificacion)
      throw new NotFoundException(
        `No se encontraron resultados para notificacion "${id}"`,
      );

    return notificacion;
  }
}
