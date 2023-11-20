import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import {
  DIRECTOR,
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
} from '../proyectos/constants';
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
          estado: Not(
            In([
              ESTADO_RESPUESTA_PROYECTOS.CANCELADO,
              ESTADO_RESPUESTA_PROYECTOS.NO_APROBADO,
            ]),
          ),
        },
      });
      totalPorTipo.push({ tipo, count });
    }

    return totalPorTipo;
  }

  async getProyectosFinalizadosPorAno() {
    const proyectosFinalizadosPorAno = [];

    const hoy = new Date(); // Obtén la fecha actual

    for (let i = 0; i < 3; i++) {
      const fechaLimite = new Date(
        hoy.getFullYear() - i,
        hoy.getMonth(),
        hoy.getDate(),
      );

      const proyectosFinalizados = await this.proyectoRepo.count({
        where: {
          estado: ESTADO_RESPUESTA_PROYECTOS.FINALIZADO,
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
        },
      });
      if (proyectosAsignados > 0) {
        proyectosPorDirector.push({ director, proyectosAsignados });
      }
    }

    return proyectosPorDirector;
  }

  async getProyectosExcluyendoEstados() {
    const proyectosExcluyendoEstados = [];

    // Itera sobre los estados del enum ESTADO_RESPUESTA_PROYECTOS
    for (const estado of Object.values(ESTADO_RESPUESTA_PROYECTOS)) {
      if (
        estado !== ESTADO_RESPUESTA_PROYECTOS.CANCELADO &&
        estado !== ESTADO_RESPUESTA_PROYECTOS.NO_APROBADO &&
        estado !== ESTADO_RESPUESTA_PROYECTOS.FINALIZADO
      ) {
        const proyectos = await this.proyectoRepo.find({
          where: {
            estado,
          },
        });
        proyectosExcluyendoEstados.push({ estado, proyectos });
      }
    }

    return proyectosExcluyendoEstados;
  }
}
