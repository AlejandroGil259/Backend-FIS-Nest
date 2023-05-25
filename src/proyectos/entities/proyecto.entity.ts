import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { OPCIONGRADO } from '../constants';
import { BaseEntity } from 'src/commons/entities/base-entity.entity';

@Entity('proyectos')
export class Proyecto extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
    type: 'uuid',
    name: 'id_proyecto',
  })
  idProyecto: string;

  @ApiProperty()
  @Column({
    name: 'id_referencia',
  })
  idReferencia: string;

  @ApiProperty({ enum: OPCIONGRADO })
  @Column({
    type: 'varchar',
    enum: OPCIONGRADO,
    name: 'opcion_grado',
  })
  opcionGrado: OPCIONGRADO;

  @ApiProperty({
    description: 'Estado del proyecto en la plataforma',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  estado: boolean;

  @ApiProperty({ description: 'Titulo del proyecto' })
  @Column()
  titulo: string;
}
