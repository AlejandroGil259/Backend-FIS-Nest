import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NIVELFORMACION, SEDES } from '../constants';

@Entity('espacios_coterminales')
export class EspaciosCoterminale {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idEspacioCoterminal: string;

  @ApiProperty({
    enum: NIVELFORMACION,
  })
  @Column({ type: 'varchar', enum: NIVELFORMACION })
  nivelFormacion: NIVELFORMACION;

  @ApiProperty()
  @Column()
  nombrePrograma: string;

  @ApiProperty({ enum: SEDES })
  @Column({ type: 'varchar', enum: SEDES })
  institucion: SEDES;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.espacioCoterminal, {
    cascade: true,
  })
  proyecto: Proyecto[];
}
