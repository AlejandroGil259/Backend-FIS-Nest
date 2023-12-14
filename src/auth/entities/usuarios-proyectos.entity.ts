import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuarios.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuarios_proyectos')
export class UsuariosProyectos {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ApiProperty()
  @Column()
  archivoProyecto: string;

  @Column({nullable: true })
  director: number;

  @Column({nullable: true })
  codirector: number;

  @Column({ nullable: true })
  segundoAutor: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;
}
