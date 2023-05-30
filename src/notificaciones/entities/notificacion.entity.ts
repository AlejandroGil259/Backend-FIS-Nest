import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { TIPO_NOTIFICACION } from '../constansts';
import { Novedad } from '../../novedades/entities/novedad.entity';
import { UsuariosNotificaciones } from '../../usuarios/entities/usuarios-notificaciones.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity( 'notificaciones' )
export class Notificacion extends BaseEntity {
  @ApiProperty( {
    uniqueItems: true,
    example: '4b87d547-ddc1-4e80-acdf-f1cd722f9f5',
  } )
  @PrimaryGeneratedColumn( 'uuid' )
  id: string;

  @ApiProperty( { example: new Date().toISOString() } )
  @Column()
  fechaNotificacion: Date;

  @ApiProperty( { example: '123456789' } )
  @Column( { type: 'int8' } )
  usuarioEnvio: number;

  @ApiProperty( { example: 'Titulo de la notificación' } )
  @Column()
  titulo: string;

  @ApiProperty( { example: 'descripcion' } )
  @Column()
  descripcion: string;

  @ApiProperty( {
    enum: TIPO_NOTIFICACION,
  } )
  @Column( {
    type: 'varchar',
    enum: TIPO_NOTIFICACION,
  } )
  tipoNotificacion: TIPO_NOTIFICACION;

  @OneToOne( () => Novedad )
  @JoinColumn( { name: 'id_novedad' } )
  novedad: Novedad;

  @OneToMany( () => Proyecto, ( notificacion ) => notificacion.notificaciones )
  proyectos: Proyecto;

  @OneToMany(
    () => UsuariosNotificaciones,
    ( usuariosNotificacion ) => usuariosNotificacion.notificaciones_id,
  )
  usuariosNotificaciones: UsuariosNotificaciones[];
}
