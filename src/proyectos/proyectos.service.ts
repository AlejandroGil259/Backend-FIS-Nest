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

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectos: Repository<UsuariosProyectos>,
    @InjectRepository(Usuario)
    private readonly usuario: Repository<Usuario>,
  ) {}

  async createProject(createProyectoDto: CreateProyectoDto) {
    const { usuarioDocumento, rolProyecto, vigenciaRol } = createProyectoDto;

    const usuario = await this.usuario.findOneBy({
      documento: usuarioDocumento,
    });

    if (!usuario)
      throw new BadRequestException(
        `No existe o se encuentra desactivado el usuario con el documento ${usuarioDocumento}`,
      );

    try {
      const proyecto = await this.proyectoRepo.save(createProyectoDto);

      const {
        proyecto: { idProyecto },
        usuario: { documento },
        ...rest
      } = await this.usuariosProyectos.save({
        proyecto,
        usuario,
        rolProyecto,
        vigenciaRol,
      });

      return { proyecto, usuarioProyecto: { idProyecto, documento, ...rest } };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const proyectos = await this.proyectoRepo.find();

    if (!proyectos || !proyectos.length)
      throw new NotFoundException('No se encontraron resultados');

    return proyectos;
  }

  async findOne(idProyecto: string) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
      relations: {
        usuariosProyectos: { usuario: true },
        archivos: true,
        novedades: true,
      },
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontraron resultados para el proyecto "${idProyecto}"`,
      );

    return proyecto;
  }

  async update(idProyecto: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepo.findOneBy({ idProyecto });
    if (!proyecto)
      throw new NotFoundException(
        `No se encontró ningun proyecto con Id ${idProyecto}`,
      );

    const { usuarioDocumento, rolProyecto, vigenciaRol, ...infoProyecto } =
      updateProyectoDto;

    try {
      const usuariosProyectos = await this.usuariosProyectos.findOneBy({
        proyecto: { idProyecto },
        usuario: { documento: usuarioDocumento },
      });

      if (!usuariosProyectos)
        throw new BadRequestException(
          `No existe la relacion con el proyecto ${idProyecto}, y el usuario ${usuarioDocumento}`,
        );

      await this.usuariosProyectos.update(
        { id: usuariosProyectos.id },
        { rolProyecto, vigenciaRol },
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
        estado: false,
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
        estado: true,
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
