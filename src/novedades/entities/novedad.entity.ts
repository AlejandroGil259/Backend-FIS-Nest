import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TIPO_NOVEDAD } from '../constansts';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('novedades')
export class Novedad extends BaseEntity {
  @ApiProperty({
    uniqueItems: true,
    example: '4b87d547-ddc1-4e80-acdf-f1cd722f9f5',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Número de Acta' })
  @Column()
  numActa: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Column()
  fechaActa: Date;

  @ApiProperty({
    enum: TIPO_NOVEDAD,
  })
  @Column({
    type: 'varchar',
    enum: TIPO_NOVEDAD,
  })
  tipoNovedad: TIPO_NOVEDAD;

  @ApiProperty({ example: 'Respuesta' })
  @Column()
  respuesta: string;

  @ApiProperty({ example: 'Observaciones' })
  @Column()
  observaciones: string;

  @OneToOne(() => Notificacion)
  notificacion: Notificacion;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.novedades, {
    onDelete: 'CASCADE',
  })
  proyectos: Proyecto;
}
