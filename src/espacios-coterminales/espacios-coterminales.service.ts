import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEspaciosCoterminaleDto } from './dto/create-espacios-coterminale.dto';
import { UpdateEspaciosCoterminaleDto } from './dto/update-espacios-coterminale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EspaciosCoterminale } from './entities/espacios-coterminale.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuarios.entity';
import { DBExceptionService } from 'src/commons/services/db-exception.service';
import { SEDES } from './constants';

@Injectable()
export class EspaciosCoterminalesService {
  constructor(
    @InjectRepository(EspaciosCoterminale)
    private readonly espaciosRepo: Repository<EspaciosCoterminale>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}
  async create(createEspaciosCoterminaleDto: CreateEspaciosCoterminaleDto) {
    const { usuariosEspacioCoCedula: usuariosEspacioCoCedula } =
      createEspaciosCoterminaleDto;
    try {
      const usuarioEspacioCo = await this.usuarioRepo.findBy({
        documento: usuariosEspacioCoCedula,
      });

      const espacioCo = await this.espaciosRepo.save({
        ...createEspaciosCoterminaleDto,
        usuarioEspacioCo,
      });

      return { espacioCo };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async findAll() {
    const espaciosCo = await this.espaciosRepo.find();

    if (!espaciosCo || !espaciosCo.length)
      throw new NotFoundException('No se encontraron resultados');

    return espaciosCo;
  }

  async findOne(idEspacioCoterminal: string) {
    const espaciosCo = await this.espaciosRepo.findOne({
      where: { idEspacioCoterminal },
    });

    if (!espaciosCo)
      throw new NotFoundException(
        `No se encontraron resultados para el espacio coterminal "${idEspacioCoterminal}"`,
      );

    return espaciosCo;
  }

  async getSede() {
    return Object.values(SEDES);
  }

  async update(
    idEspacioCoterminal: string,
    updateEspaciosCoterminaleDto: UpdateEspaciosCoterminaleDto,
  ) {
    const espaciosCo = await this.espaciosRepo.findOneBy({
      idEspacioCoterminal,
    });
    if (!espaciosCo)
      return new NotFoundException(
        `No se encontró ningun espacio coterminal con el Id programa ${idEspacioCoterminal}`,
      );

    try {
      return await this.espaciosRepo.update(
        { idEspacioCoterminal },
        { ...updateEspaciosCoterminaleDto },
      );
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }
}
