import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { DOC_STATUS } from '../constants';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

@Entity('archivos')
export class Archivo extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
  })
  id: string;

  @ApiProperty({ example: 'pdf, word' })
  @Column({ type: 'varchar' })
  nombreArchivoOriginal: string;

  @ApiProperty({ example: 'pdf, word' })
  @Column({ type: 'varchar' })
  nombreArchivoServidor: string;

  @ApiProperty({ example: 'SergioG' })
  @Column()
  autor: string;

  @ApiProperty({
    description: 'Estado del archivo en la plataforma',
    enum: DOC_STATUS,
  })
  @Column({ type: 'varchar', enum: DOC_STATUS })
  estado: DOC_STATUS;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.archivos)
  proyecto: Proyecto;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.archivos)
  solicitud: Solicitud;
}
