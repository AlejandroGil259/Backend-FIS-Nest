import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';
import { ROLES } from '../constants';
import { UsuariosProyectos } from './usuarios-proyectos.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @ApiProperty({
    uniqueItems: true,
    example: 123456789,
  })
  @Column({
    primary: true,
    type: 'int8',
    unique: true,
  })
  documento: number;

  @ApiProperty({
    example: 2251184,
    type: Number,
    description: 'Código del estudiante',
  })
  @Column({
    type: 'int8',
    nullable: true,
    unique: true,
  })
  codigo?: number;

  @ApiProperty({
    enum: ROLES,
    default: ROLES.ESTUDIANTE,
  })
  @Column({
    type: 'varchar',
    enum: ROLES,
    default: ROLES.ESTUDIANTE,
  })
  rol: ROLES;

  @ApiProperty({ example: 'N.N' })
  @Column()
  nombres: string;

  @ApiProperty({ example: 'Rodriguez' })
  @Column()
  apellidos: string;

  @ApiProperty({ example: 'example@usantoto.edu.co' })
  @Column()
  correo: string;

  @ApiProperty({ example: 'Minimo 6 caracteres' })
  @Column()
  contrasena: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Column({ type: 'date', nullable: true })
  periodoIngreso?: Date;

  @ApiProperty({
    description: 'Estado del usuario en la plataforma',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  estado: boolean;

  @ApiProperty({
    example: 3126650202,
    type: Number,
  })
  @Column({ type: 'int8', nullable: true })
  telefono?: number;

  @ApiProperty({
    description: 'Estado del docente en el comite y en la plataforma',
    default: true,
  })
  @Column({
    type: 'bool',
    default: false,
  })
  comite: boolean;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario, {
    cascade: true,
  })
  solicitudes: Solicitud[];

  // @OneToOne(() => Notificacion)
  // enviarNotificacion: Notificacion[];

  @OneToMany(() => Notificacion, (notificacion) => notificacion.usuariosReceptores)
  notificaciones: Notificacion[];

  @OneToMany(
    () => UsuariosProyectos,
    (usuarioProyecto) => usuarioProyecto.usuario,
    { cascade: true },
  )
  usuariosProyectos: UsuariosProyectos[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.correo = this.correo.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

// @ApiProperty es para documentar las propiedades en Swagger, no tiene afectación en la DB
