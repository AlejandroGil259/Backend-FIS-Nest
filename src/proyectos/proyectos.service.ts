import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DBExceptionService } from '../commons/services/db-exception.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { UsuariosProyectos } from '../auth/entities/usuarios-proyectos.entity';
import { OPCION_GRADO, ESTADO_RESPUESTA_PROYECTOS } from './constants';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    private readonly authService: AuthService,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectosRepo: Repository<UsuariosProyectos>,
  ) {}

  async crearProyecto(
    createProyectoDto: CreateProyectoDto,
    usuarioDocumento: number,
  ) {
    const { ...infoProyecto } = createProyectoDto;

    try {
      // Obtener el usuario (estudiante) por el documento
      const usuario = await this.authService.findOne(usuarioDocumento);

      if (!usuario) {
        throw new NotFoundException(
          `No se encontró al usuario con el documento ${usuarioDocumento}`,
        );
      }
      // Verificar el rol del usuario
      if (usuario.rol !== 'Estudiante') {
        throw new ForbiddenException(
          'Lo sentimos solo los estudiantes pueden crear proyectos.',
        );
      }

      // Crear el proyecto
      const proyecto = this.proyectoRepo.create(infoProyecto);
      const nuevoProyecto = await this.proyectoRepo.save(proyecto);

      // Crear la relación UsuariosProyectos
      const usuariosProyectos = this.usuariosProyectosRepo.create({
        usuario,
        proyecto: nuevoProyecto,
        archivoProyecto: createProyectoDto.archivoProyecto,
        director: createProyectoDto.director,
        codirector: createProyectoDto.codirector,
        segundoAutor: createProyectoDto.segundoAutor,
      });

      await this.usuariosProyectosRepo.save(usuariosProyectos);

      return nuevoProyecto;
    } catch (error) {
      DBExceptionService.handleDBException(error);
    }
  }

  async getProjectsByUserDocument(documento: number): Promise<Proyecto[]> {
    const usuariosProyectos = await this.usuariosProyectosRepo.find({
      where: { usuario: { documento: documento } }, // Buscar en UsuariosProyectos por el número de documento del usuario
      relations: ['proyecto'], // Incluir la relación 'proyecto'
    });

    if (usuariosProyectos && usuariosProyectos.length > 0) {
      // Extraer la lista de proyectos desde los registros de UsuariosProyectos
      const proyectos = usuariosProyectos.map((up) => up.proyecto);

      return proyectos;
    } else {
      throw new NotFoundException(
        `El usuario "${documento}" no existe en la base de datos o no tiene proyectos asociados.`,
      );
    }
  }

  async findAllWithUserDetails() {
    const proyectos = await this.proyectoRepo
      .createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.usuariosProyectos', 'usuariosProyectos')
      .leftJoinAndSelect('usuariosProyectos.usuario', 'usuario')
      .getMany();

    if (!proyectos || !proyectos.length) {
      throw new NotFoundException('No se encontraron resultados');
    }

    return proyectos;
  }

  async findOne(idProyecto: string) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
      relations: ['usuariosProyectos', 'usuariosProyectos.usuario', 'entregas'],
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontraron resultados para el proyecto "${idProyecto}"`,
      );

    return proyecto;
  }

  async getOpcionGrado() {
    return Object.values(OPCION_GRADO);
  }

  obtenerEstadosProyectos(): string[] {
    // Obtener y devolver un array con los valores del enum
    return Object.values(ESTADO_RESPUESTA_PROYECTOS);
  }

  async update(idProyecto: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepo.findOneBy({ idProyecto });
    if (!proyecto)
      throw new NotFoundException(
        `No se encontró ningun proyecto con Id ${idProyecto}`,
      );

    const { usuarioDocumento, archivoProyecto, ...infoProyecto } =
      updateProyectoDto;

    try {
      const usuario = await this.authService.findOne(usuarioDocumento);

      if (!usuario) {
        throw new NotFoundException(
          `No se encontró ningun usuario con documento ${usuarioDocumento}`,
        );
      }
      const usuariosProyectos = await this.usuariosProyectosRepo.findOneBy({
        proyecto: { idProyecto },
        usuario: { documento: usuarioDocumento },
      });

      if (!usuariosProyectos)
        throw new BadRequestException(
          `No existe la relacion con el proyecto ${idProyecto}, y el usuario ${usuarioDocumento}`,
        );

      await this.usuariosProyectosRepo.update(
        { id: usuariosProyectos.id },
        { archivoProyecto },
      );

      await this.proyectoRepo.update({ idProyecto }, { ...infoProyecto });

      return `El proyecto con ID ${idProyecto} ha sido actualizado`;
    } catch (error) {
      DBExceptionService.handleDBException(error);
    }
  }

  async desactivate(idProyecto: string) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
      withDeleted: false,
    });

    if (!proyecto)
      throw new NotFoundException(
        `El proyecto con el Id ${idProyecto}, ya se encuentra eliminado o no existe en la base de datos`,
      );

    const { affected } = await this.proyectoRepo.update(
      { idProyecto },
      {
        estado: ESTADO_RESPUESTA_PROYECTOS.CANCELADO,
        deletedAt: new Date(),
      },
    );

    if (!affected || affected === 0)
      throw new BadRequestException(
        `No se pudo eliminar el proyecto con el id ${idProyecto}`,
      );

    return 'El proyecto fue eliminado/desactivado correctamente';
  }

  async restore(idProyecto: string) {
    try {
      const proyecto = await this.proyectoRepo.findOne({
        where: { idProyecto },
        withDeleted: true,
      });

      if (!proyecto) {
        throw new NotFoundException(
          `No se encontró un proyecto con el Id ${idProyecto}`,
        );
      }

      // Si ya está activo, no hay necesidad de restaurar
      if (!proyecto.deletedAt) {
        throw new BadRequestException(
          `El proyecto con el Id ${idProyecto} ya está activo`,
        );
      }

      // Restaurar el proyecto estableciendo deletedAt a null
      await this.proyectoRepo.update(
        { idProyecto },
        {
          deletedAt: null,
        },
      );

      return 'El proyecto fue restaurado/activado correctamente';
    } catch (error) {
      throw new BadRequestException(
        `No se pudo activar el proyecto con el Id ${idProyecto}`,
      );
    }
  }

  async remove(idProyecto: string) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
      withDeleted: true,
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontró ningun proyecto con el Id ${idProyecto} `,
      );

    return await this.proyectoRepo.remove(proyecto);
  }
}
