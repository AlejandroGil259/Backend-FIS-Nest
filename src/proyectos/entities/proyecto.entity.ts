import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import {
  CODIRECTOR,
  DIRECTOR,
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
  TIPO_ENTREGA,
} from '../constants';
import { Archivo } from '../../archivos/entities/archivo.entity';
import { UsuariosProyectos } from '../../auth/entities/usuarios-proyectos.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';
import { Pasantia } from '../../pasantias/entities/pasantia.entity';
import { EspaciosCoterminale } from '../../espacios-coterminales/entities/espacios-coterminale.entity';

@Entity('proyectos')
export class Proyecto extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idProyecto: string;

  @ApiProperty()
  @Column()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @Column({
    type: 'varchar',
    enum: OPCION_GRADO,
  })
  opcionGrado: OPCION_GRADO;

  @ApiProperty({ enum: TIPO_ENTREGA })
  @Column({
    type: 'varchar',
    enum: TIPO_ENTREGA,
  })
  tipoEntrega: TIPO_ENTREGA;

  @ApiProperty({ example: 'Número de Acta' })
  @Column({ nullable: true })
  numActa?: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Column({ nullable: true })
  fechaActa?: Date;

  @ApiProperty({ enum: DIRECTOR })
  @Column({
    type: 'varchar',
    enum: DIRECTOR,
  })
  director: DIRECTOR;

  @ApiProperty({ enum: CODIRECTOR })
  @Column({
    type: 'varchar',
    enum: CODIRECTOR,
    nullable: true,
  })
  codirector?: CODIRECTOR;

  @ApiProperty({ example: 'Nombre del segundo autor' })
  @Column({ nullable: true })
  segundoAutor?: string;

  @ApiProperty({ example: 'Nombre evaluador1' })
  @Column({ nullable: true })
  evaluador1?: string;

  @ApiProperty({ example: 'Nombre evaluador2' })
  @Column({ nullable: true })
  evaluador2?: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA_PROYECTOS,
    description: 'Respuesta del estado del proyecto',
    default: ESTADO_RESPUESTA_PROYECTOS.ENVIADO,
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA_PROYECTOS,
    default: ESTADO_RESPUESTA_PROYECTOS.ENVIADO,
  })
  estado: ESTADO_RESPUESTA_PROYECTOS;

  @ApiProperty({
    description: 'Proyecto activo en la plataforma',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  activo: boolean;

  @ApiProperty({ description: 'Titulo del proyecto' })
  @Column({ unique: true })
  titulo: string;

  @ApiProperty({ description: 'descripcion' })
  @Column({ nullable: true })
  descripcion?: string;

  @OneToOne(() => Pasantia, (pasantia) => pasantia.proyecto)
  @JoinColumn()
  pasantia: Pasantia;

  @OneToOne(
    () => EspaciosCoterminale,
    (espacioCoterminal) => espacioCoterminal.proyecto,
  )
  @JoinColumn()
  espacioCoterminal: EspaciosCoterminale;

  @OneToMany(() => Archivo, (archivo) => archivo.proyectos, {
    cascade: true,
    eager: true,
  })
  archivos: Archivo[];

  // @OneToMany(() => Novedad, (novedad) => novedad.proyectos, { cascade: true })
  // novedades: Novedad[];

  @OneToMany(() => Notificacion, (notificacion) => notificacion.proyectos, {
    cascade: true,
  })
  notificaciones: Notificacion;

  @OneToMany(
    () => UsuariosProyectos,
    (usuarioProyecto) => usuarioProyecto.proyecto,
    { cascade: true },
  )
  usuariosProyectos: UsuariosProyectos[];
}
