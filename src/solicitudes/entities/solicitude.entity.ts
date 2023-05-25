import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/entities/base-entity.entity';
import { Column, Entity } from 'typeorm';
import { TIPOSOLICITUD } from '../constants';

@Entity('solicitudes')
export class Solicitude extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
    type: 'integer',
    name: 'id_solicitud',
  })
  idSolicitud: number;

  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @Column()
  contenido: string;

  @ApiProperty({ enum: TIPOSOLICITUD })
  @Column({
    type: 'varchar',
    enum: TIPOSOLICITUD,
  })
  rol: TIPOSOLICITUD;

  //Campo date opcional
  @ApiProperty()
  @Column()
  fecha: Date;

  @ApiProperty()
  @Column({
    name: 'ruta_carta',
  })
  rutaCarta: string;

  @ApiProperty()
  @Column({
    name: 'resp_carta',
  })
  respCarta: string;

  @ApiProperty({
    description: 'Respuesta del estado de la solicitud',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
    name: 'resp_estado',
  })
  respEstado: boolean;
}
