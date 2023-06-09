import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { CreateNotificacionesDto } from '../../notificaciones/dto/create-notificaciones.dto';
import { TIPO_NOVEDAD } from '../constansts';

export class CreateNovedadesDto extends CreateNotificacionesDto {
    @ApiProperty( { example: 'Número de Acta' } )
    @IsString()
    numActa: string;

    @ApiProperty( { type: Date, example: new Date().toISOString() } )
    @IsDateString()
    fechaActa: Date;

    @ApiProperty( {
        enum: TIPO_NOVEDAD,
    } )
    @IsEnum( TIPO_NOVEDAD )
    tipoNovedad: TIPO_NOVEDAD;

    @ApiProperty( { example: 'Respuesta' } )
    @IsString()
    respuesta: string;

    @ApiProperty( { example: 'Observaciones' } )
    @IsString()
    observaciones: string;
}
