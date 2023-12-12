import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';
import { Entregas } from '../../entregas/entities/entregas.entity';

@Entity('archivos')
export class Archivo extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idArchivo: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  nombreArchivoOriginal: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  nombreArchivoServidor: string;

  @ManyToOne(() => Entregas, (entrega) => entrega.archivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idEntrega' })
  entregas: Entregas;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.archivos, {
    onDelete: 'CASCADE',
  })
  solicitud: Solicitud;
}
