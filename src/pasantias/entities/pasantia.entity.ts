import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuarios.entity';

@Entity('pasantias')
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

  @OneToOne(() => Proyecto)
  @JoinColumn({ name: 'idProyecto' })
  proyecto: Proyecto;
}
