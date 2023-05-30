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

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
  ) {}

  async createProject(createProyectoDto: CreateProyectoDto) {
    try {
      const project = await this.proyectoRepo.save(createProyectoDto);
      return {
        proyecto: project,
      };
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
      relations: { archivos: true, novedades: true },
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

    try {
      return await this.proyectoRepo.update(
        { idProyecto },
        { ...updateProyectoDto },
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
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontró ningun proyecto con el Id ${idProyecto} `,
      );

    return await this.proyectoRepo.remove(proyecto);
  }
}
