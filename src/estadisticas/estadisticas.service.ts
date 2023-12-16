import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import {
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
} from '../proyectos/constants';
import { LessThan } from 'typeorm';
import { AuthService } from '../auth/services/auth.service';
import { Usuario } from 'src/auth/entities/usuarios.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    private authService: AuthService,
  ) {}

  async getTotalProyectosPorTipo() {
    const totalPorTipo = [];

    // Filtra por cada tipo de OPCION_GRADO
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

  // async getProyectosPorDirector() {
  //   const proyectosPorDirector = [];

  //   // Itera sobre los directores del enum DIRECTOR
  //   for (const director of Object.values(DIRECTOR)) {
  //     const proyectosAsignados = await this.proyectoRepo.count({
  //       where: {
  //         director,
  //       },
  //     });
  //     if (proyectosAsignados > 0) {
  //       proyectosPorDirector.push({ director, proyectosAsignados });
  //     }
  //   }

  //   return proyectosPorDirector;
  // }

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

      console.log(
        'Conteo de proyectos por director:',
        countProyectosPorDocente,
      );

      // Formatear el resultado como un arreglo de objetos
      const resultado = await Promise.all(
        Object.keys(countProyectosPorDocente).map(async (documento) => ({
          docente: await this.authService.findOne(Number(documento)),
          countProyectos: countProyectosPorDocente[documento],
        })),
      );

      console.log('Resultado final:', resultado);

      return resultado;
    } catch (error) {
      console.error('Error en cuentaProyectosDocentes:', error);
      throw error;
    }
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
