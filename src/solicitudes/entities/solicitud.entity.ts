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

  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @Column()
  contenido: string;

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
  asunto: string;

  @ApiProperty()
  @Column()
  archivoCarta: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA,
    description: 'Respuesta del estado de la solicitud',
    default: ESTADO_RESPUESTA.ESPERA,
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA,
    default: ESTADO_RESPUESTA.ESPERA,
  })
  respEstado: ESTADO_RESPUESTA;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;

  @OneToMany(() => Archivo, (archivo) => archivo.proyectos, { cascade: true })
  archivos: Archivo[];
}
