import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { OPCION_GRADO } from '../proyectos/constants';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async getTotalProyectosPorTipo() {
    const totalPorTipo = {};

    // Itera sobre los valores de OPCION_GRADO y cuenta proyectos por tipo
    for (const tipo in OPCION_GRADO) {
      if (OPCION_GRADO.hasOwnProperty(tipo)) {
        const count = await this.proyectoRepo.count({
          where: {
            opcionGrado: OPCION_GRADO[tipo],
          },
        });
        totalPorTipo[OPCION_GRADO[tipo]] = count;
      }
    }

    return totalPorTipo;
  }
}
