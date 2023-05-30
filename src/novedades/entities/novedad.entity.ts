import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { TIPO_NOVEDAD } from '../constansts';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Notificaciones } from '../../notificaciones/entities/notificaciones.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('novedades')
export class Novedad extends BaseEntity {
  @ApiProperty({
    uniqueItems: true,
    example: 123456789,
  })
  @Column({
    primary: true,
    unique: true,
    type: 'uuid',
  })
  id: string;

  @ApiProperty({ example: 'Número de Acta' })
  @Column()
  numActa: string;

  @ApiProperty({ example: '01-01-2023' })
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

  @OneToOne(() => Notificaciones)
  notificacion: Notificaciones;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.novedades)
  proyecto: Proyecto;
}
