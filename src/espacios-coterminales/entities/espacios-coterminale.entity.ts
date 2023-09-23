import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SEDES } from '../constants';

@Entity('espacio_coterminal')
export class EspaciosCoterminale {
  @ApiProperty({
    uniqueItems: true,
    example: 636402,
  })
  @Column({
    primary: true,
    type: 'int8',
    unique: true,
  })
  idPrograma: number;

  @ApiProperty()
  @Column()
  nombrePrograma: string;

  @ApiProperty({ enum: SEDES })
  @Column({ type: 'varchar', enum: SEDES })
  institucion: SEDES;

  @OneToOne(() => Proyecto)
  @JoinColumn()
  proyecto: Proyecto;
}
