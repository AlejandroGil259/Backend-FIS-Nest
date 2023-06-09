import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { TIPO_NOTIFICACION } from '../constansts';

export class CreateNotificacionesDto {
    @ApiProperty( { example: new Date().toISOString() } )
    @IsDateString()
    fechaNotificacion: Date;

    @ApiProperty( { example: 123456789 } )
    @IsNumber()
    usuarioEmisorDocumento: number;

    @ApiProperty( { example: 'Titulo de la notificación' } )
    @IsString()
    titulo: string;

    @ApiProperty( { example: 'descripcion' } )
    @IsString()
    descripcion: string;

    @ApiProperty( {
        enum: TIPO_NOTIFICACION,
        example: TIPO_NOTIFICACION.REVISION
    } )
    @IsEnum( TIPO_NOTIFICACION )
    tipoNotificacion: TIPO_NOTIFICACION;

    @ApiProperty( { example: [ 123456789, 2251184 ], isArray: true } )
    @IsArray()
    usuariosReceptoresDocumentos: number[];
}
