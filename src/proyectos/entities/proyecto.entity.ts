import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { ESTADO_RESPUESTA_PROYECTOS, OPCION_GRADO } from '../constants';
import { UsuariosProyectos } from '../../auth/entities/usuarios-proyectos.entity';
import { Pasantia } from '../../pasantias/entities/pasantia.entity';
import { EspaciosCoterminale } from '../../espacios-coterminales/entities/espacios-coterminale.entity';
import { Entregas } from '../../entregas/entities/entregas.entity';

@Entity('proyectos')
export class Proyecto extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idProyecto: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA_PROYECTOS,
    description: 'Respuesta del estado del proyecto',
  })
  @Column({
    type: 'varchar',
    enum: ESTADO_RESPUESTA_PROYECTOS,
  })
  estado?: ESTADO_RESPUESTA_PROYECTOS;

  @ApiProperty({ enum: OPCION_GRADO })
  @Column({
    type: 'varchar',
    enum: OPCION_GRADO,
  })
  opcionGrado: OPCION_GRADO;

  @ApiProperty({ description: 'Titulo del proyecto' })
  @Column()
  tituloVigente?: string;

  @OneToOne(() => Pasantia, (pasantia) => pasantia.proyecto)
  @JoinColumn()
  pasantia: Pasantia;

  @ManyToOne(
    () => EspaciosCoterminale,
    (espacioCoterminal) => espacioCoterminal.proyecto,
    {
      onDelete: 'CASCADE',
    },
  )
  espacioCoterminal: EspaciosCoterminale;

  @OneToMany(() => Entregas, (entrega) => entrega.proyecto, {
    cascade: true,
    eager: true,
  })
  entregas: Entregas[];

  @OneToMany(
    () => UsuariosProyectos,
    (usuarioProyecto) => usuarioProyecto.proyecto,
    { cascade: true, eager: true },
  )
  usuariosProyectos: UsuariosProyectos[];
}
