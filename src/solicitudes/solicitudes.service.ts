import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuarios.entity';
import { DBExceptionService } from '../commons/services/db-exception.service';
import { CreateSolicitudesDto } from './dto/create-solicitudes.dto';
import { UpdateSolicitudesDto } from './dto/update-solicitudes.dto';
import { Solicitud } from './entities/solicitud.entity';
import { ESTADO_RESPUESTA_SOLICITUD, TIPO_SOLICITUD } from './constants';
import { Archivo } from '../archivos/entities/archivo.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Archivo)
    private readonly archivoRepo: Repository<Archivo>,
  ) {}

  async create(createSolicitudesDto: CreateSolicitudesDto) {
    const { usuarioDocumento } = createSolicitudesDto;

    try {
      // Busca el usuario por número de documento
      const usuarioSolicitudes = await this.usuarioRepo.findOne({
        where: { documento: usuarioDocumento },
      });

      if (!usuarioSolicitudes) {
        throw new Error('Usuario no encontrado');
      }

      // Crea una nueva instancia de Solicitud
      const solicitud = this.solicitudRepo.create(createSolicitudesDto);

      // Establece la relación entre la solicitud y el usuario
      solicitud.usuario = usuarioSolicitudes;

      // Guarda la solicitud en la base de datos
      const solicitudGuardada = await this.solicitudRepo.save(solicitud);

      return {
        solicitud: solicitudGuardada,
      };
    } catch (error) {
      // Maneja las excepciones de la base de datos
      throw new NotFoundException(
        `No se encontro al usuario registrado con documento: "${usuarioDocumento}"`,
      );
    }
  }
  async findAll() {
    const solicitudes = await this.solicitudRepo.find();

    if (!solicitudes || !solicitudes.length)
      throw new NotFoundException('No se encontraron resultados');

    return solicitudes;
  }

  async findOne(idSolicitud: string) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { idSolicitud },
      relations: {
        usuario: true,
        archivos: true,
      },
    });

    if (!solicitud)
      throw new NotFoundException(
        `No se encontraron resultados para la solicitud "${idSolicitud}"`,
      );

    return solicitud;
  }

  async getTipoSolicitud() {
    return Object.values(TIPO_SOLICITUD);
  }

  async getEstado() {
    return Object.values(ESTADO_RESPUESTA_SOLICITUD);
  }

  async update(
    idSolicitud: string,
    updateSolicitudesDto: UpdateSolicitudesDto,
  ): Promise<{ message: string; solicitud: Solicitud }> {
    const solicitud = await this.solicitudRepo.findOneBy({ idSolicitud });
    if (!solicitud)
      throw new NotFoundException(
        `No se encontró ninguna solicitud con el Id ${idSolicitud}`,
      );

    try {
      await this.solicitudRepo.update(
        { idSolicitud },
        { ...updateSolicitudesDto },
      );

      const updatedSolicitud = await this.solicitudRepo.findOneBy({
        idSolicitud,
      });

      return {
        message: 'Solicitud actualizada exitosamente',
        solicitud: updatedSolicitud,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async remove(idSolicitud: string) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { idSolicitud },
      withDeleted: true,
    });

    if (!solicitud) throw new NotFoundException('Esta solicitud no existe');

    return await this.solicitudRepo.remove(solicitud);
  }
}
