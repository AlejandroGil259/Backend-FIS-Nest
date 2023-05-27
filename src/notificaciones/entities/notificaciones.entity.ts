import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { TIPO_NOTIFICACION } from '../constansts';
import { BaseEntity } from '../../commons/entities/base-entity.entity';

@Entity('notificaciones')
export class Notificaciones extends BaseEntity {
  @ApiProperty({
    uniqueItems: true,
    example: 123456789,
  })
  @Column({
    primary: true,
    unique: true,
  })
  id: string;

  @ApiProperty({ example: '01-01-2023' })
  @Column()
  fechaNotificacion: Date;

  @ApiProperty({ example: '123456789' })
  @Column({ type: 'int8' })
  usuarioEnvio: number;

  @ApiProperty({ example: 'Titulo de la notificación' })
  @Column()
  titulo: string;

  @ApiProperty({ example: 'descripcion' })
  @Column()
  descripcion: string;

  @ApiProperty({
    enum: TIPO_NOTIFICACION,
  })
  @Column({
    type: 'varchar',
    enum: TIPO_NOTIFICACION,
  })
  tipoNotificacion: TIPO_NOTIFICACION;
}
