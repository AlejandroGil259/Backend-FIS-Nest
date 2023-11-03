import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { DIRECTOR, OPCION_GRADO } from '../proyectos/constants';
import { LessThan } from 'typeorm';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async getTotalProyectosPorTipo() {
    const totalPorTipo = [];

    // Itera sobre los valores de OPCION_GRADO y cuenta proyectos por tipo
    for (const tipo of Object.values(OPCION_GRADO)) {
      const count = await this.proyectoRepo.count({
        where: {
          opcionGrado: tipo,
        },
      });
      totalPorTipo.push({ tipo, count });
    }

    return totalPorTipo;
  }

  // async getProyectosFinalizadosPorAno(ano: number) {
  //   const hoy = new Date(); // Obtén la fecha actual

  //   // Asumimos que un proyecto se considera "finalizado" si la fecha de creación es anterior al año que se proporciona como parámetro
  //   const proyectosFinalizados = await this.proyectoRepo.find({
  //     where: {
  //       createdAt: LessThan(
  //         new Date(hoy.getFullYear() - ano, hoy.getMonth(), hoy.getDate()),
  //       ),
  //       // También podrías agregar otras condiciones si es necesario
  //     },
  //   });

  //   return proyectosFinalizados.length;
  // }

  async getProyectosFinalizadosPorAno(ano: number) {
    const proyectosFinalizadosPorAno = [];

    const hoy = new Date(); // Obtén la fecha actual

    for (let i = 0; i < ano; i++) {
      const fechaLimite = new Date(
        hoy.getFullYear() - i,
        hoy.getMonth(),
        hoy.getDate(),
      );

      const proyectosFinalizados = await this.proyectoRepo.count({
        where: {
          createdAt: LessThan(fechaLimite),
        },
      });

      proyectosFinalizadosPorAno.push({
        ano: hoy.getFullYear() - i,
        proyectosFinalizados,
      });
    }

    return proyectosFinalizadosPorAno;
  }

  async getProyectosPorDirector() {
    const proyectosPorDirector = [];

    // Itera sobre los directores del enum DIRECTOR
    for (const director of Object.values(DIRECTOR)) {
      const proyectosAsignados = await this.proyectoRepo.count({
        where: {
          director,
          // También podrías agregar otras condiciones si es necesario
        },
      });

      proyectosPorDirector.push({ director, proyectosAsignados });
    }

    return proyectosPorDirector;
  }
}
