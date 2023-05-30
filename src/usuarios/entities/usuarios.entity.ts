import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { ROLES } from '../constants';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

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
    description: 'Código del programa para el estudiante',
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

  @ApiProperty({ example: 'max-10' })
  @Column()
  contrasena: string;

  @ApiProperty({
    example: 20181,
    type: Number,
  })
  @Column({ type: 'integer', nullable: true })
  periodoIngreso?: number;

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

  @OneToMany(() => Solicitud, (solicitudes) => solicitudes.usuario)
  solicitudes: Solicitud[];
}

// @ApiProperty es para documentar las propiedades en Swagger, no tiene afectación en la DB
