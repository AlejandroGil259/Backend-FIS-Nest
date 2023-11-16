import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../auth/entities/usuarios.entity';
import { UsuariosProyectos } from 'src/auth/entities/usuarios-proyectos.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectosRepo: Repository<UsuariosProyectos>,
  ) {}

  async create(createNotificacionDto: CreateNotificacionesDto) {
    const { idProyecto, usuarioEmisorDocumento, usuariosReceptoresDocumentos } =
      createNotificacionDto;

    try {
      // Verificar si el usuario emisor tiene el proyecto asociado
      const usuarioProyecto = await this.usuariosProyectosRepo.findOne({
        where: {
          proyecto: { idProyecto },
          usuario: { documento: usuarioEmisorDocumento },
        },
      });

      if (!usuarioProyecto) {
        throw new NotFoundException(
          `El usuario emisor "${usuarioEmisorDocumento}"no tiene acceso al proyecto especificado.`,
        );
      }

      // Verificar si todos los usuarios receptores están registrados
      const usuariosReceptores = await this.usuarioRepo.find({
        where: { documento: In(usuariosReceptoresDocumentos) },
      });

      if (usuariosReceptores.length !== usuariosReceptoresDocumentos.length) {
        throw new NotFoundException(
          'Alguno de los usuarios receptores no está registrado y no se pueden enviar notificaciones.',
        );
      }

      const notificacion = await this.notificacionRepo.save({
        ...createNotificacionDto,
        usuariosReceptores,
      });

      return { notificacion };
    } catch (error) {
      console.error('Error al crear y enviar notificación:', error);
      throw error;
    }
  }

  async findAll() {
    const notificaciones = await this.notificacionRepo.find();

    if (!notificaciones || !notificaciones.length)
      throw new NotFoundException('No se encontraron resultados');

    return notificaciones;
  }

  async getNotificacionesPorRol(rol: string) {
    try {
      const notificaciones = await this.notificacionRepo
        .createQueryBuilder('notificacion')
        .innerJoinAndSelect('notificacion.usuariosReceptores', 'usuario')
        .where('usuario.rol = :rol', { rol })
        .getMany();

      return notificaciones;
    } catch (error) {
      console.error('Error al buscar notificaciones por rol:', error);
      throw new NotFoundException(
        'Ocurrió un error al buscar notificaciones por rol',
      );
    }
  }

  async findOne(id: string) {
    const notificacion = await this.notificacionRepo.findOne({
      where: { id },
    });

    if (!notificacion)
      throw new NotFoundException(
        `No se encontraron resultados para notificacion "${id}"`,
      );

    return notificacion;
  }

  async getNotificacionesPorDocumento(documento: number) {
    try {
      // Verificar si el usuario con el número de documento existe
      const usuario = await this.usuarioRepo.findOne({ where: { documento } });

      if (!usuario) {
        throw new Error('No se encontraron notificaciones para el usuario.');
      }

      const notificaciones = await this.notificacionRepo
        .createQueryBuilder('notificacion')
        .innerJoinAndSelect('notificacion.usuariosReceptores', 'usuario')
        .where('usuario.documento = :documento', { documento })
        .getMany();

      return notificaciones;
    } catch (error) {
      console.error('No se encontro al usuario:', error);
      throw new NotFoundException(
        `No se encontraron notificaciones para el usuario "${documento}"`,
      );
    }
  }

  async remove(id: string) {
    const notificacion = await this.notificacionRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!notificacion)
      throw new NotFoundException('Esta notificacion no existe');

    return await this.notificacionRepo.remove(notificacion);
  }
}
