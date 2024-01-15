import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import {
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
} from '../proyectos/constants';
import { AuthService } from '../auth/services/auth.service';
//import { Entregas } from '../entregas/entities/entregas.entity';
//import { ESTADO_ENTREGAS } from '../entregas/constants';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    // @InjectRepository(Entregas)
    // private entregasRepo: Repository<Entregas>,
    private authService: AuthService,
  ) {}

  async getTotalProyectosPorTipo() {
    const totalPorTipo = [];

    // Filtramos por cada tipo de OPCION_GRADO
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
  async contarProyectosFinalizados(): Promise<
    { anio: number; cantidad: number }[]
  > {
    const fechaLimite = new Date(
      new Date().getFullYear() - 2,
      11,
      31,
      23,
      59,
      59,
      999,
    );

    const proyectosFinalizados = await this.proyectoRepo.find({
      where: {
        estado: ESTADO_RESPUESTA_PROYECTOS.FINALIZADO,
        createdAt: MoreThan(fechaLimite),
      },
    });

    const proyectosPorAnio = proyectosFinalizados.reduce((acc, proyecto) => {
      const anio = proyecto.createdAt.getFullYear();

      if (!acc[anio]) {
        acc[anio] = 1;
      } else {
        acc[anio]++;
      }

      return acc;
    }, {});

    // Garantizar resultados para los últimos tres años, incluso si no hay proyectos finalizados
    const aniosActuales = Array.from(
      { length: 3 },
      (_, index) => new Date().getFullYear() - index,
    );
    aniosActuales.forEach((anio) => {
      if (!proyectosPorAnio[anio]) {
        proyectosPorAnio[anio] = 0;
      }
    });

    // Convertir el objeto a un arreglo y ordenar por año de forma descendente
    const resultado = Object.keys(proyectosPorAnio)
      .map((anio) => ({
        anio: parseInt(anio),
        cantidad: proyectosPorAnio[anio],
      }))
      .sort((a, b) => b.anio - a.anio);

    return resultado;
  }

  async cuentaProyectosDocentes() {
    try {
      // Obtener todos los proyectos con sus relaciones
      const proyectos = await this.proyectoRepo.find({
        relations: ['usuariosProyectos', 'usuariosProyectos.usuario'],
      });

      // Obtener directores únicos asociados a proyectos
      const directoresUnicos = new Set<number>();

      proyectos.forEach((proyecto) => {
        proyecto.usuariosProyectos.forEach((usuarioProyecto) => {
          const directorDocumento = usuarioProyecto.director;

          if (directorDocumento && directorDocumento !== 0) {
            directoresUnicos.add(directorDocumento);
          }
        });
      });

      const directoresArray = Array.from(directoresUnicos);

      // Filtrar directores que no están registrados en la base de datos
      const directoresRegistrados = await Promise.all(
        directoresArray.map(async (documento) => {
          const directorRegistrado = await this.authService.findOne(documento);

          return directorRegistrado ? documento : null;
        }),
      );

      // Contar los proyectos para cada director registrado
      const countProyectosPorDocente = {};

      proyectos.forEach((proyecto) => {
        proyecto.usuariosProyectos.forEach((usuarioProyecto) => {
          const directorDocumento = usuarioProyecto.director;

          if (directoresRegistrados.includes(directorDocumento)) {
            countProyectosPorDocente[directorDocumento] =
              (countProyectosPorDocente[directorDocumento] || 0) + 1;
          }
        });
      });

      // console.log(
      //   'Conteo de proyectos por director:',
      //   countProyectosPorDocente,
      // );

      // Formatear el resultado como un arreglo de objetos
      const resultado = await Promise.all(
        Object.keys(countProyectosPorDocente).map(async (documento) => ({
          docente: await this.authService.findOne(Number(documento)),
          countProyectos: countProyectosPorDocente[documento],
        })),
      );

      //console.log('Resultado final:', resultado);

      return resultado;
    } catch (error) {
      console.error('Error en cuentaProyectosDocentes:', error);
      throw error;
    }
  }

  async getProyectosExcluyendoEstados() {
    const proyectosExcluyendoEstados = [];

    // Itera sobre los estados del enum ESTADO_ENTREGAS
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
