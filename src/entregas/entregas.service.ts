import {
  BadRequestException,
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
import { UsuariosProyectos } from 'src/auth/entities/usuarios-proyectos.entity';

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entregas)
    private readonly entregasRepo: Repository<Entregas>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectosRepo: Repository<UsuariosProyectos>,
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

  async getProyectosByEvaluador(evaluadorId: number) {
    const entregas = await this.entregasRepo
      .createQueryBuilder('entregas')
      .leftJoinAndSelect('entregas.proyecto', 'proyecto')
      .where(
        'entregas.evaluador1 = :evaluadorId OR entregas.evaluador2 = :evaluadorId',
        { evaluadorId },
      )
      .getMany();

    // Obtener solo los proyectos de las entregas
    const proyectos = entregas.map((entrega) => entrega.proyecto);

    return proyectos;
  }
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

    const { idProyecto, evaluador1, evaluador2, ...infoEntrega } =
      updateEntregaDto;

    try {
      // Asegurarnos de que el proyecto asociado exista
      const proyecto = await this.proyectosService.findOne(idProyecto);
      if (!proyecto)
        throw new NotFoundException(
          `No se encontró un proyecto con ID ${idProyecto} asociado a la entrega con ID ${idEntrega}`,
        );

      // Obtener la relación UsuariosProyectos
      const usuariosProyectos = await this.usuariosProyectosRepo.findOne({
        where: { proyecto: { idProyecto } },
      });

      if (evaluador1 === evaluador2) {
        throw new BadRequestException(
          'El evaluador1 y el evaluador2 no pueden ser la misma persona.',
        );
      }

      if (
        evaluador1 === usuariosProyectos.director ||
        evaluador1 === usuariosProyectos.codirector
      ) {
        throw new BadRequestException(
          'El evaluador1 no puede ser el mismo que el director o el codirector del proyecto.',
        );
      }

      if (
        evaluador2 === usuariosProyectos.director ||
        evaluador2 === usuariosProyectos.codirector
      ) {
        throw new BadRequestException(
          'El evaluador2 no puede ser el mismo que el director o el codirector del proyecto.',
        );
      }

      // Actualizar la entrega con los nuevos evaluadores y el proyecto
      entrega.tipoEntrega = infoEntrega.tipoEntrega;
      entrega.descripcion = infoEntrega.descripcion;
      entrega.numActa = infoEntrega.numActa;
      entrega.fechaActa = infoEntrega.fechaActa;
      entrega.archivoEntrega = infoEntrega.archivoEntrega;
      entrega.evaluador1 = evaluador1;
      entrega.evaluador2 = evaluador2;
      entrega.proyecto = proyecto;

      await this.entregasRepo.save(entrega);

      return proyecto;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        const errorMessage = DBExceptionService.handleDBException(error);
        throw {
          success: false,
          message: errorMessage || 'Error al actualizar la entrega',
        };
      }
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
