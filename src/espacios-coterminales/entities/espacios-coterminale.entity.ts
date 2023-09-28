import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SEDES } from '../constants';

@Entity('espacio_coterminal')
export class EspaciosCoterminale {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idPrograma: string;
  
  @ApiProperty({
    example: 636402,
  })
  @Column()
  codigoPrograma: number;

  @ApiProperty()
  @Column()
  nombrePrograma: string;

  @ApiProperty({ enum: SEDES })
  @Column({ type: 'varchar', enum: SEDES })
  institucion: SEDES;

  @ApiProperty()
  @Column()
  usuariosEspacioCoCedula: number;

  @OneToOne(() => Proyecto)
  @JoinColumn()
  proyecto: Proyecto;
}
