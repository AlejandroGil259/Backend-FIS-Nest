import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { ESTADO_RESPUESTA, TIPO_SOLICITUD } from '../constants';
import { Usuario } from '../../usuarios/entities/usuarios.entity';

@Entity('solicitudes')
export class Solicitudes extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
    unique: true,
    type: 'uuid',
  })
  idSolicitud: string;

  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @Column()
  contenido: string;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @Column({
    type: 'varchar',
    enum: TIPO_SOLICITUD,
  })
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty()
  @Column()
  rutaCarta: string;

  @ApiProperty()
  @Column()
  respCarta: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA,
    description: 'Respuesta del estado de la solicitud',
    default: ESTADO_RESPUESTA.ESPERA,
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA,
    default: ESTADO_RESPUESTA.ESPERA,
  })
  respEstado: ESTADO_RESPUESTA;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  usuario: Usuario;
}
