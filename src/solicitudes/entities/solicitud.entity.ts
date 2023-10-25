import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { ESTADO_RESPUESTA, TIPO_SOLICITUD } from '../constants';
import { Usuario } from '../../auth/entities/usuarios.entity';
import { Archivo } from '../../archivos/entities/archivo.entity';

@Entity('solicitudes')
export class Solicitud extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idSolicitud: string;

  @ApiProperty({ description: 'Agregar descripción a la solicitud' })
  @Column()
  descripcion: string;

  @ApiProperty()
  @Column()
  nombres: string;

  @ApiProperty()
  @Column()
  apellidos: string;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @Column({
    type: 'varchar',
    enum: TIPO_SOLICITUD,
  })
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty()
  @Column()
  archivoCarta: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA,
    description: 'Respuesta del estado de la solicitud',
    default: ESTADO_RESPUESTA.REVISION,
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA,
    default: ESTADO_RESPUESTA.REVISION,
  })
  respEstado: ESTADO_RESPUESTA;

  @ApiProperty()
  @Column()
  usuariosSolicitudesDocumento: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  usuario: Usuario;

  @OneToMany(() => Archivo, (archivo) => archivo.proyectos, { cascade: true })
  archivos: Archivo[];
}
