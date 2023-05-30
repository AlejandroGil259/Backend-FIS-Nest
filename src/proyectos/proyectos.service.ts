import { Injectable, NotFoundException } from '@nestjs/common';
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
      relations: { archivos: true },
    });

    if (!proyecto)
      throw new NotFoundException(
        `No se encontraron resultados para el proyecto "${idProyecto}"`,
      );

    return proyecto;
  }

  async update(idProyecto: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepo.findOne({ where: { idProyecto } });

    if (!proyecto) throw new NotFoundException('Este proyecto no existe');
    const actualizarProyecto = Object.assign(proyecto, updateProyectoDto);

    return await this.proyectoRepo.save(actualizarProyecto);
  }

  async remove(idProyecto: string) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { idProyecto },
    });

    if (!proyecto) {
      throw new NotFoundException('Este proyecto no existe');
    }

    await this.proyectoRepo.remove(proyecto);
  }
}
