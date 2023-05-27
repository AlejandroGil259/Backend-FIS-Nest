import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { DOC_STATUS } from '../constants';

@Entity( 'archivos' )
export class Archivo extends BaseEntity {
    @ApiProperty( { uniqueItems: true } )
    @Column( {
        primary: true,
        type: 'integer',
    } )
    id: number;

    @ApiProperty( { example: 'pdf, word' } )
    @Column( { type: 'varchar' } )
    nombreArchivoOriginal: string;

    @ApiProperty( { example: 'pdf, word' } )
    @Column( { type: 'varchar' } )
    nombreArchivoServidor: string;

    @ApiProperty( { example: 'SergioG' } )
    @Column()
    autor: string;

    @ApiProperty( {
        description: 'Estado del archivo en la plataforma',
        enum: DOC_STATUS,
    } )
    @Column( { type: 'varchar', enum: DOC_STATUS } )
    estado: DOC_STATUS;
}
