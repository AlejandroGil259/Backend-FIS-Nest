import {
  BadRequestException,
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
import { Usuario } from '../auth/entities/usuarios.entity';
import {
  DIRECTOR,
  OPCION_GRADO,
  TIPO_ENTREGA,
  ESTADO_RESPUESTA_PROYECTOS,
} from './constants';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectosRepo: Repository<UsuariosProyectos>,
    @InjectRepository(Usuario)
    private readonly usuario: Repository<Usuario>,
  ) {}

  async obtenerProyectosPorDirector(director: DIRECTOR): Promise<Proyecto[]> {
    const proyectos = await this.proyectoRepo.find({
      where: { director },
    });

    if (!proyectos || proyectos.length === 0) {
      throw new NotFoundException(
        `No se encontraron proyectos para el director ${director}`,
      );
    }

    return proyectos;
  }

  async createProject(createProyectoDto: CreateProyectoDto) {
    const { usuarioDocumento, archivoProyecto, director, codirector } =
      createProyectoDto;

    // Verificar que el director y el codirector no sean el mismo
    if (director.valueOf() === codirector?.valueOf()) {
      throw new BadRequestException(
        'El director y el codirector no pueden ser la misma persona.',
      );
    }
    const usuario = await this.usuario.findOneBy({
      documento: usuarioDocumento,
    });

    if (!usuario)
      throw new BadRequestException(
        `No existe o se encuentra desactivado el usuario con el documento ${usuarioDocumento}`,
      );

    // Asociar el proyecto con el director
    const proyecto = this.proyectoRepo.create(createProyectoDto);
    proyecto.director = director;
    await this.proyectoRepo.save(proyecto);

    try {
      //const proyecto = await this.proyectoRepo.save(createProyectoDto);

      const {
        proyecto: { idProyecto },
        usuario: { documento },
        ...rest
      } = await this.usuariosProyectosRepo.save({
        proyecto,
        usuario,
        archivoProyecto,
      });

      return { proyecto, usuarioProyecto: { idProyecto, documento, ...rest } };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
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

  // async findAll() {
  //   const proyectos = await this.proyectoRepo.find();

  //   if (!proyectos || !proyectos.length)
  //     throw new NotFoundException('No se encontraron resultados');

  //   return proyectos;
  // }

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
      relations: {
        usuariosProyectos: { usuario: true },
        archivos: true,
      },
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
  async getTipoEntrega() {
    return Object.values(TIPO_ENTREGA);
  }

  async getDirectores() {
    const directoresArray = Object.values(DIRECTOR);
    const directoresOrdenados = directoresArray.sort((a, b) =>
      a.localeCompare(b),
    );
    return directoresOrdenados;
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

      return await this.proyectoRepo.update(
        { idProyecto },
        { ...infoProyecto },
      );
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
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
      withDeleted: true,
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontró un proyecto con el Id ${idProyecto} `,
      );

    if (proyecto.estado)
      throw new BadRequestException(
        `El proyecto con el Id ${idProyecto} ya se encuentra activo`,
      );

    const { affected } = await this.proyectoRepo.update(
      { idProyecto },
      {
        estado: ESTADO_RESPUESTA_PROYECTOS.ENVIADO,
        deletedAt: null,
      },
    );

    if (!affected || affected === 0)
      throw new BadRequestException(
        `No se pudo activar el proyecto con el Id ${idProyecto}`,
      );

    return 'El proyecto fue restaurado/activado correctamente';
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
