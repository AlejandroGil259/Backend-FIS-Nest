import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

@Entity('archivos')
export class Archivo extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'pdf, word' })
  @Column()
  extensionArchivo: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.archivos, {
    onDelete: 'CASCADE',
  })
  proyectos: Proyecto;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.archivos, {
    onDelete: 'CASCADE',
  })
  solicitud: Solicitud;
}
