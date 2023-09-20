import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { OPCION_GRADO, TIPO_ENTREGA } from '../constants';
import { Archivo } from '../../archivos/entities/archivo.entity';
import { Novedad } from '../../novedades/entities/novedad.entity';
import { UsuariosProyectos } from '../../auth/entities/usuarios-proyectos.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';

@Entity('proyectos')
export class Proyecto extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idProyecto: string;

  @ApiProperty()
  @Column()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @Column({
    type: 'varchar',
    enum: OPCION_GRADO,
  })
  opcionGrado: OPCION_GRADO;

  @ApiProperty({ enum: TIPO_ENTREGA })
  @Column({
    type: 'varchar',
    enum: TIPO_ENTREGA,
  })
  tipoEntrega: TIPO_ENTREGA;

  @ApiProperty({ description: 'Nombre del director' })
  @Column({
    type: 'varchar',
  })
  director: string;

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
  @Column({ unique: true })
  titulo: string;

  @ApiProperty({ description: 'descripcion' })
  @Column({})
  descripcion: string;

  @OneToMany(() => Archivo, (archivo) => archivo.proyectos, { cascade: true })
  archivos: Archivo[];

  @OneToMany(() => Novedad, (novedad) => novedad.proyectos, { cascade: true })
  novedades: Novedad[];

  @OneToMany(() => Notificacion, (proyecto) => proyecto.proyectos, {
    cascade: true,
  })
  notificaciones: Notificacion;

  @OneToMany(
    () => UsuariosProyectos,
    (usuarioProyecto) => usuarioProyecto.proyecto,
    { cascade: true },
  )
  usuariosProyectos: UsuariosProyectos[];
}
