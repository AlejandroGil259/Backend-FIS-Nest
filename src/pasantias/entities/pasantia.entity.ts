import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pasantia')
export class Pasantia {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn('uuid')
  idPasantia: string;

  @ApiProperty()
  @Column()
  nombreEmpresa: string;

  @ApiProperty()
  @Column()
  fechaInicio: Date;

  @ApiProperty()
  @Column()
  fechaFin: Date;

  @ApiProperty({ description: 'Ubicación de la empresa' })
  @Column()
  ubicacion: string;

  @ApiProperty()
  @Column()
  usuarioPasantiaCedula: number;

  @OneToOne(() => Proyecto)
  @JoinColumn()
  proyecto: Proyecto;
}
