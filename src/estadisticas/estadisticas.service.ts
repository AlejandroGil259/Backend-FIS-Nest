import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import {
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
} from '../proyectos/constants';
import { AuthService } from '../auth/services/auth.service';
import { TIPO_SOLICITUD } from '../solicitudes/constants';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Solicitud)
    private solicitudRepo: Repository<Solicitud>,
    private authService: AuthService,
  ) {}

  async getTotalProyectosPorTipo() {
    const totalPorTipo = [];

    // Filtramos por cada tipo de OPCION_GRADO
    for (const tipo of Object.values(OPCION_GRADO)) {
      // Consulta para contar proyectos únicos por título y opción de grado
      const proyectosUnicos = await this.proyectoRepo.query(`
      SELECT COUNT(DISTINCT titulo_vigente) as count
      FROM proyectos
      WHERE opcion_grado = '${tipo}'
        AND estado NOT IN ('${ESTADO_RESPUESTA_PROYECTOS.CANCELADO}', '${ESTADO_RESPUESTA_PROYECTOS.NO_APROBADO}')
    `);

      // Añadimos el resultado al arreglo totalPorTipo
      totalPorTipo.push({ tipo, count: proyectosUnicos[0]?.count || 0 });
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

    // Ultimos 3 años, incluso si no hay proyectos finalizados
    const aniosActuales = Array.from(
      { length: 3 },
      (_, index) => new Date().getFullYear() - index,
    );
    aniosActuales.forEach((anio) => {
      if (!proyectosPorAnio[anio]) {
        proyectosPorAnio[anio] = 0;
      }
    });

    // Convertir el objeto a un arreglo y ordenar por año
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
      const proyectos = await this.proyectoRepo.find({
        relations: ['usuariosProyectos', 'usuariosProyectos.usuario'],
      });

      // Utilizar un conjunto para almacenar combinaciones únicas de título y director
      const combinacionesUnicas = new Set<string>();

      // Contar los proyectos para cada director registrado
      const countProyectosPorDocente = {};

      proyectos.forEach((proyecto) => {
        proyecto.usuariosProyectos.forEach((usuarioProyecto) => {
          const directorDocumento = usuarioProyecto.director;
          const tituloProyecto = proyecto.tituloVigente;
          const estadoProyecto = proyecto.estado;

          if (
            directorDocumento &&
            directorDocumento !== 0 &&
            tituloProyecto &&
            estadoProyecto !== 'Finalizado'
          ) {
            const combinacionUnica = `${directorDocumento}_${tituloProyecto}`;

            // Verificar si ya se ha contado esta combinación única
            if (!combinacionesUnicas.has(combinacionUnica)) {
              // Incrementar el contador para este director
              countProyectosPorDocente[directorDocumento] =
                (countProyectosPorDocente[directorDocumento] || 0) + 1;

              // Agregar la combinación única al conjunto
              combinacionesUnicas.add(combinacionUnica);
            }
          }
        });
      });

      // Formatear el resultado como un arreglo de objetos
      const resultado = await Promise.all(
        Object.keys(countProyectosPorDocente).map(async (documento) => ({
          docente: await this.authService.findOne(Number(documento)),
          countProyectos: countProyectosPorDocente[documento],
        })),
      );

      return resultado;
    } catch (error) {
      console.error('Error en cuentaProyectosDocentes:', error);
      throw error;
    }
  }

  async getProyectosExcluyendoEstados() {
    const proyectosExcluyendoEstados = [];

    // Filtrar estados que no deben incluirse en la cuenta
    const estadosFiltrados = Object.values(ESTADO_RESPUESTA_PROYECTOS).filter(
      (estado) =>
        estado !== ESTADO_RESPUESTA_PROYECTOS.CANCELADO &&
        estado !== ESTADO_RESPUESTA_PROYECTOS.NO_APROBADO &&
        estado !== ESTADO_RESPUESTA_PROYECTOS.FINALIZADO,
    );

    for (const estado of estadosFiltrados) {
      const proyectos = await this.proyectoRepo.find({
        where: {
          estado,
        },
      });

      const combinacionesUnicas = new Set<string>();
      const proyectosFiltrados = [];

      proyectos.forEach((proyecto) => {
        const tituloProyecto = proyecto.tituloVigente;

        if (tituloProyecto) {
          const combinacionUnica = `${tituloProyecto}_${estado}`;

          // Verificar si ya se ha contado esta combinación única
          if (!combinacionesUnicas.has(combinacionUnica)) {
            proyectosFiltrados.push(proyecto);
            combinacionesUnicas.add(combinacionUnica);
          }
        }
      });

      proyectosExcluyendoEstados.push({
        estado,
        proyectos: proyectosFiltrados,
      });
    }

    return proyectosExcluyendoEstados;
  }

  async contarSolicitudesPorTipo(): Promise<
    { tipo: TIPO_SOLICITUD; count: number }[]
  > {
    const tiposSolicitud = Object.values(TIPO_SOLICITUD);
    const resultados: { tipo: TIPO_SOLICITUD; count: number }[] = [];

    for (const tipo of tiposSolicitud) {
      const count = await this.solicitudRepo.count({
        where: { tipoSolicitud: tipo },
      });
      resultados.push({ tipo, count });
    }

    return resultados;
  }
}
