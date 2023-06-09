import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { OPCION_GRADO } from '../constants';
import { Archivo } from '../../archivos/entities/archivo.entity';
import { Novedad } from '../../novedades/entities/novedad.entity';
import { UsuariosProyectos } from '../../usuarios/entities/usuarios-proyectos.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';

@Entity( 'proyectos' )
export class Proyecto extends BaseEntity {
    @ApiProperty( { uniqueItems: true } )
    @PrimaryGeneratedColumn( 'uuid' )
    idProyecto: string;

    @ApiProperty()
    @Column()
    idReferencia: string;

    @ApiProperty( { enum: OPCION_GRADO } )
    @Column( {
        type: 'varchar',
        enum: OPCION_GRADO,
    } )
    opcionGrado: OPCION_GRADO;

    @ApiProperty( {
        description: 'Estado del proyecto en la plataforma',
        default: true,
    } )
    @Column( {
        type: 'bool',
        default: true,
    } )
    estado: boolean;

    @ApiProperty( { description: 'Titulo del proyecto' } )
    @Column( { unique: true } )
    titulo: string;

    @OneToMany( () => Archivo, ( archivo ) => archivo.proyecto )
    archivos: Archivo[];

    @OneToMany( () => Novedad, ( novedad ) => novedad.proyecto )
    novedades: Novedad[];

    @OneToMany( () => Notificacion, ( proyecto ) => proyecto.proyectos )
    notificaciones: Notificacion;

    @OneToMany(
        () => UsuariosProyectos,
        ( usuarioProyecto ) => usuarioProyecto.usuario,
        { cascade: true }
    )
    usuariosProyectos: UsuariosProyectos[];
}
