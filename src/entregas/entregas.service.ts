import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateEntregasDto } from './dto/create-entregas.dto';
import { UpdateEntregasDto } from './dto/update-entregas.dto';
import { TIPO_ENTREGA } from './constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Entregas } from './entities/entregas.entity';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../commons/services/db-exception.service';
import { ProyectosService } from '../proyectos/proyectos.service';

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entregas)
    private readonly entregasRepo: Repository<Entregas>,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService,
  ) {}

  async crearEntrega(createEntregaDto: CreateEntregasDto): Promise<Entregas> {
    const { idProyecto, ...restoDto } = createEntregaDto;

    // Validar que el proyecto exista
    const proyecto = await this.proyectosService.findOne(idProyecto);
    if (!proyecto) {
      throw new NotFoundException(
        `No se encontró un proyecto con el ID ${idProyecto}`,
      );
    }

    // Crear la entrega
    try {
      const entrega = this.entregasRepo.create({
        ...restoDto,
        proyecto, // Asignar el proyecto encontrado
      });
      const nuevaEntrega = await this.entregasRepo.save(entrega);
      return nuevaEntrega;
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  // obtenerEstadosEntregas(): string[] {
  //   return Object.values(ESTADO_ENTREGAS);
  // }

  async findAll() {
    const entregas = await this.entregasRepo.find();

    if (!entregas || !entregas.length)
      throw new NotFoundException('No se encontraron resultados');

    return entregas;
  }

  async findOne(idEntrega: string) {
    const entrega = await this.entregasRepo.findOne({
      where: { idEntrega },
      relations: {
        proyecto: true,
        archivos: true,
      },
    });

    if (!entrega)
      throw new NotFoundException(
        `No se encontraron resultados para la entrega con ID "${idEntrega}"`,
      );

    return entrega;
  }

  async getTipoEntrega() {
    return Object.values(TIPO_ENTREGA);
  }

  async update(idEntrega: string, updateEntregaDto: UpdateEntregasDto) {
    const entrega = await this.entregasRepo.findOneBy({ idEntrega });
    if (!entrega)
      throw new NotFoundException(
        `No se encontró ninguna entrega con ID ${idEntrega}`,
      );

    const { idProyecto, ...infoEntrega } = updateEntregaDto;

    try {
      // Asegurarnos de que el proyecto asociado exista
      const proyecto = await this.proyectosService.findOne(idProyecto);
      if (!proyecto)
        throw new NotFoundException(
          `No se encontró un proyecto con ID ${idProyecto} asociado a la entrega con ID ${idEntrega}`,
        );

      await this.entregasRepo.update(
        { idEntrega },
        { ...infoEntrega, proyecto },
      );

      return `La entrega con ID ${idEntrega} ha sido actualizada`;
    } catch (error) {
      throw new NotFoundException(
        `No se encontró ningun proyecto con ID ${idProyecto}`,
      );
    }
  }

  async save(entrega: Entregas): Promise<Entregas> {
    try {
      const savedEntrega = await this.entregasRepo.save(entrega);
      return savedEntrega;
    } catch (error) {
      throw error;
    }
  }

  async remove(idEntrega: string) {
    const entrega = await this.entregasRepo.findOne({
      where: { idEntrega },
      withDeleted: true,
    });

    if (!entrega)
      throw new NotFoundException(
        `No se encontró ninguna entrega con el Id ${idEntrega} `,
      );

    return await this.entregasRepo.remove(entrega);
  }
}
