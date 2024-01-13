import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TIPO_ENTREGA } from '../constants';
import { Archivo } from '../../archivos/entities/archivo.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { BaseEntity } from '../../commons/entities/base-entity.entity';

@Entity('entregas')
export class Entregas extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idEntrega: string;

  @ApiProperty({ enum: TIPO_ENTREGA })
  @Column({
    type: 'varchar',
    enum: TIPO_ENTREGA,
  })
  tipoEntrega: TIPO_ENTREGA;

  // @ApiProperty({
  //   enum: ESTADO_ENTREGAS,
  //   description: 'Respuesta del estado del proyecto',
  //   default: ESTADO_ENTREGAS.ENVIADO,
  // })
  // @Column({
  //   type: 'varchar',
  //   enum: ESTADO_ENTREGAS,
  //   default: ESTADO_ENTREGAS.ENVIADO,
  // })
  // estado: ESTADO_ENTREGAS;

  @ApiProperty({ description: 'descripcion' })
  @Column({ nullable: true })
  descripcion?: string;

  @ApiProperty({ example: 'Nombre evaluador1' })
  @Column({ nullable: true })
  evaluador1?: number;

  @ApiProperty({ example: 'Nombre evaluador2' })
  @Column({ nullable: true })
  evaluador2?: number;

  @ApiProperty({ example: 'Número de Acta' })
  @Column({ nullable: true })
  numActa?: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Column({ nullable: true })
  fechaActa?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  archivoEntrega?: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.entregas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @OneToMany(() => Archivo, (archivo) => archivo.entregas, {
    cascade: true,
    eager: true,
  })
  archivos: Archivo[];
}
