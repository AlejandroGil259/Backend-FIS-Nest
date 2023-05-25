import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne } from "typeorm";

import { BaseEntity } from "../../commons/entities/base-entity.entity";
import { ROLES } from "../constants";
import { Estudiante } from "./estudiante.entity";

@Entity( 'usuarios' )
export class Usuario extends BaseEntity {
    @ApiProperty( { uniqueItems: true } )
    @Column( {
        primary: true, type: 'integer'
    } )
    documento: number;

    @ApiProperty( { enum: ROLES } )
    @Column( {
        type: 'varchar', enum: ROLES
    } )
    rol: ROLES;

    @ApiProperty( { example: "N.N" } )
    @Column()
    nombres: string;

    @ApiProperty( { example: 'Rodriguez' } )
    @Column()
    apellidos: string;

    @ApiProperty( {
        description: 'Estado del usuario en la plataforma',
        default: true
    } )
    @Column( {
        type: 'bool', default: true
    } )
    estado: boolean;

    @OneToOne( () => Estudiante, ( estudiante ) => estudiante.usuario )
    estudiante: Estudiante;
}


// @ApiProperty es para documentar las propiedades en Swagger, no tiene afectación en la DB