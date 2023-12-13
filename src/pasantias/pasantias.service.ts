import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdatePasantiaDto } from './dto/update-pasantia.dto';
import { Pasantia } from './entities/pasantia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuarios.entity';
import { DBExceptionService } from '../commons/services/db-exception.service';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Injectable()
export class PasantiasService {
  constructor(
    @InjectRepository(Pasantia)
    private readonly pasantiaRepo: Repository<Pasantia>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(createPasantiaDto: CreatePasantiaDto) {
    try {
      // Crear la pasantía y asociarla al proyecto y usuario
      const pasantia = this.pasantiaRepo.create({
        ...createPasantiaDto,
      });

      await this.pasantiaRepo.save(pasantia);

      return { pasantia };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }
  async findAll() {
    const pasantias = await this.pasantiaRepo.find();

    if (!pasantias || !pasantias.length)
      throw new NotFoundException('No se encontraron resultados');

    return pasantias;
  }

  async findOne(idPasantia: string) {
    const pasantia = await this.pasantiaRepo.findOne({
      where: { idPasantia },
    });

    if (!pasantia)
      throw new NotFoundException(
        `No se encontraron resultados para pasantia "${idPasantia}"`,
      );

    return pasantia;
  }

  async update(idPasantia: string, updatePasantiaDto: UpdatePasantiaDto) {
    const pasantia = await this.pasantiaRepo.findOneBy({ idPasantia });
    if (!pasantia)
      return new NotFoundException(
        `No se encontró ninguna pasantia con el Id ${idPasantia}`,
      );

    try {
      return await this.pasantiaRepo.update(
        { idPasantia },
        { ...updatePasantiaDto },
      );
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async remove(idPasantia: string) {
    const pasantia = await this.pasantiaRepo.findOne({
      where: { idPasantia },
      withDeleted: true,
    });

    if (!pasantia)
      throw new NotFoundException(
        `No se encontró ningun proyecto con el Id ${idPasantia} `,
      );

    return await this.pasantiaRepo.remove(pasantia);
  }
}
