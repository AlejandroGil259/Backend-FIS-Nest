import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { Usuario } from './usuarios.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity( 'estudiantes' )
export class Estudiante extends BaseEntity {
    @ApiProperty( {
        example: 2251184,
        type: Number,
        description: 'Código del programa para el estudiante'
    } )
    @Column( {
        primary: true, type: 'integer'
    } )
    codigo: number;

    @ApiProperty( {
        example: 20181,
        type: Number
    } )
    @Column( { type: 'integer', name: 'periodo_ingreso' } )
    periodoIngreso: number;

    @ApiProperty( {
        example: 122333, type: Number
    } )
    @Column( { type: 'integer', nullable: true } )
    telefono?: number;

    @ApiProperty( {
        example: 131345,
        type: Number,
        description: 'Documento de identidad del usuario'
    } )
    @OneToOne(
        () => Usuario,
        ( usuario ) => usuario.estudiante,
        { nullable: false }
    )
    @JoinColumn( {
        name: 'usuario_documento',
    } )
    usuario: Usuario;
}