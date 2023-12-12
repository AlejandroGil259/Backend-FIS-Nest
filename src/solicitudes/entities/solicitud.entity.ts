import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { ESTADO_RESPUESTA_SOLICITUD, TIPO_SOLICITUD } from '../constants';
import { Usuario } from '../../auth/entities/usuarios.entity';
import { Archivo } from '../../archivos/entities/archivo.entity';

@Entity('solicitudes')
export class Solicitud extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idSolicitud: string;

  @ApiProperty()
  @Column()
  nombres: string;

  @ApiProperty()
  @Column()
  apellidos: string;

  @ApiProperty({ example: 'Número de Acta' })
  @Column({ nullable: true })
  numActa?: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Column({ nullable: true })
  fechaActa?: Date;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @Column({
    type: 'varchar',
    enum: TIPO_SOLICITUD,
  })
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty({ description: 'Agregar descripción a la solicitud' })
  @Column()
  descripcion: string;

  @ApiProperty()
  @Column()
  archivoCarta: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA_SOLICITUD,
    description: 'Respuesta del estado de la solicitud',
    default: ESTADO_RESPUESTA_SOLICITUD.ENVIADO,
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA_SOLICITUD,
    default: ESTADO_RESPUESTA_SOLICITUD.ENVIADO,
  })
  respEstado: ESTADO_RESPUESTA_SOLICITUD;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  @JoinColumn({ name: 'usuarioDocumento' })
  usuario: Usuario;

  @OneToMany(() => Archivo, (archivo) => archivo.solicitud, { cascade: true })
  archivos: Archivo[];
}
