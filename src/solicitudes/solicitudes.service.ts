import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolicitudesDto } from './dto/create-solicitudes.dto';
import { UpdateSolicitudesDto } from './dto/update-solicitudes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitudes } from './entities/solicitudes.entity';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../commons/services/db-exception.service';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitudes)
    private readonly solicitudRepo: Repository<Solicitudes>,
  ) {}

  async create(createSolicitudesDto: CreateSolicitudesDto) {
    try {
      const solicitud = await this.solicitudRepo.save(createSolicitudesDto);

      return {
        solicitudes: solicitud,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const solicitudes = await this.solicitudRepo.find();

    if (!solicitudes || !solicitudes.length)
      throw new NotFoundException('No se encontraron resultados');

    return solicitudes;
  }

  async findOne(idSolicitud: string) {
    const solicitud = await this.solicitudRepo.findOneBy({ idSolicitud });

    if (!solicitud)
      throw new NotFoundException(
        `No se encontraron resultados para la solicitud "${idSolicitud}"`,
      );

    return solicitud;
  }

  async update(
    idSolicitud: string,
    updateSolicitudesDto: UpdateSolicitudesDto,
  ) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { idSolicitud },
    });

    if (!solicitud) throw new NotFoundException('Esta solicitud no existe');
    const actualizarSolicitud = Object.assign(solicitud, updateSolicitudesDto);

    return await this.solicitudRepo.save(actualizarSolicitud);
  }

  async remove(idSolicitud: string) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { idSolicitud },
    });

    if (!solicitud) {
      throw new NotFoundException('Esta solicitud no existe');
    }

    await this.solicitudRepo.remove(solicitud);
  }
}
