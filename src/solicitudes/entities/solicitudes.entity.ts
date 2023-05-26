import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { TIPO_SOLICITUD } from '../constants';

@Entity( 'solicitudes' )
export class Solicitudes extends BaseEntity {
    @ApiProperty( { uniqueItems: true } )
    @Column( {
        primary: true,
        type: 'uuid',
    } )
    idSolicitud: number;

    @ApiProperty( { description: 'Agregar contenido a la solicitud' } )
    @Column()
    contenido: string;

    @ApiProperty( { enum: TIPO_SOLICITUD } )
    @Column( {
        type: 'varchar',
        enum: TIPO_SOLICITUD,
    } )
    rol: TIPO_SOLICITUD;

    @ApiProperty()
    @Column( {
        name: 'ruta_carta',
    } )
    rutaCarta: string;

    @ApiProperty()
    @Column( {
        name: 'resp_carta',
    } )
    respCarta: string;

    @ApiProperty( {
        description: 'Respuesta del estado de la solicitud',
        default: true,
    } )
    @Column( {
        type: 'bool',
        default: true,
        name: 'resp_estado',
    } )
    respEstado: boolean;
}
