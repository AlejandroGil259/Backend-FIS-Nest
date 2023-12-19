import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ESTADO_RESPUESTA_SOLICITUD, TIPO_SOLICITUD } from '../constants';

export class CreateSolicitudesDto {
  @ApiProperty({ example: 'Nombres' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Apellidos' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: 'Número de Acta' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  numActa?: string;

  @ApiProperty({ type: Date, example: new Date().toISOString() })
  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  fechaActa?: Date;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @IsEnum(TIPO_SOLICITUD)
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 'Respuesta de la carta' })
  @IsString()
  @IsOptional()
  archivoCarta: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA_SOLICITUD,
    description: 'Respuesta del estado de la solicitud',
    default: ESTADO_RESPUESTA_SOLICITUD.ENVIADO,
  })
  @IsEnum(ESTADO_RESPUESTA_SOLICITUD)
  @IsOptional()
  respEstado: ESTADO_RESPUESTA_SOLICITUD;

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  @IsOptional()
  usuarioDocumento?: number;
}
