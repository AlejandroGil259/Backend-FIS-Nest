import { Proyecto } from 'src/proyectos/entities/proyecto.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuarios_proyectos')
export class UsuariosProyectos {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ApiProperty()
  @Column()
  rolProyecto: string;

  @ApiProperty()
  @Column()
  vigenciaRol: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuariosProyectos, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.usuariosProyectos, {
    onDelete: 'CASCADE',
  })
  proyecto: Proyecto;
}
