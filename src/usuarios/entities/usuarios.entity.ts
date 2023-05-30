import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';
import { ROLES } from '../constants';
import { UsuariosNotificaciones } from './usuarios-notificaciones.entity';
import { UsuariosProyectos } from './usuarios-proyectos.entity';

@Entity( 'usuarios' )
export class Usuario extends BaseEntity {
    @ApiProperty( {
        uniqueItems: true,
        example: 123456789,
    } )
    @Column( {
        primary: true,
        type: 'int8',
        unique: true,
    } )
    documento: number;

    @ApiProperty( {
        example: 2251184,
        type: Number,
        description: 'Código del estudiante',
    } )
    @Column( {
        type: 'int8',
        nullable: true,
        unique: true,
    } )
    codigo?: number;

    @ApiProperty( {
        enum: ROLES,
        default: ROLES.ESTUDIANTE,
    } )
    @Column( {
        type: 'varchar',
        enum: ROLES,
        default: ROLES.ESTUDIANTE,
    } )
    rol: ROLES;

    @ApiProperty( { example: 'N.N' } )
    @Column()
    nombres: string;

    @ApiProperty( { example: 'Rodriguez' } )
    @Column()
    apellidos: string;

    @ApiProperty( { example: 'example@usantoto.edu.co' } )
    @Column()
    correo: string;

    @ApiProperty( { example: 'max-10' } )
    @Column()
    contrasena: string;

    @ApiProperty( {
        example: 20181,
        type: Number,
    } )
    @Column( { type: 'integer', nullable: true } )
    periodoIngreso?: number;

    @ApiProperty( {
        description: 'Estado del usuario en la plataforma',
        default: true,
    } )
    @Column( {
        type: 'bool',
        default: true,
    } )
    estado: boolean;

    @ApiProperty( {
        example: 3126650202,
        type: Number,
    } )
    @Column( { type: 'int8', nullable: true } )
    telefono?: number;

    @ApiProperty( {
        description: 'Estado del docente en el comite y en la plataforma',
        default: true,
    } )
    @Column( {
        type: 'bool',
        default: false,
    } )
    comite: boolean;

    @OneToMany( () => Solicitud, ( solicitudes ) => solicitudes.usuario )
    solicitudes: Solicitud[];

    @OneToMany( () => UsuariosNotificaciones, ( enviar ) => enviar.usuarioDocumento )
    enviarNotificaciones: UsuariosNotificaciones[];

    @OneToMany( () => UsuariosNotificaciones, ( recibir ) => recibir.usuarioReceptor )
    recibirNotificaciones: UsuariosNotificaciones[];

    @OneToMany(
        () => UsuariosProyectos,
        ( usuarioProyecto ) => usuarioProyecto.usuarioDocumento,
    )
    usuariosProyectos: UsuariosProyectos[];
}


// @ApiProperty es para documentar las propiedades en Swagger, no tiene afectación en la DB
