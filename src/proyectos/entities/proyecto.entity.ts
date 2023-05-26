import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { OPCION_GRADO } from '../constants';

@Entity( 'proyectos' )
export class Proyecto extends BaseEntity {
    @ApiProperty( { uniqueItems: true } )
    @Column( {
        primary: true,
        type: 'uuid',
    } )
    idProyecto: string;

    @ApiProperty()
    @Column()
    idReferencia: string;

    @ApiProperty( { enum: OPCION_GRADO } )
    @Column( {
        type: 'varchar',
        enum: OPCION_GRADO
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
    @Column()
    titulo: string;
}
