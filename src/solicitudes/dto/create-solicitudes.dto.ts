import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { TIPO_SOLICITUD } from '../constants';

export class CreateSolicitudesDto {
  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @IsString()
  contenido: string;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @IsEnum(TIPO_SOLICITUD)
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty({ example: 'Cambio de director' })
  @IsString()
  rutaCarta: string;

  @ApiProperty({ example: 'Respuesta de la carta' })
  @IsString()
  respCarta: string;

  @ApiProperty({ example: [123456789, 2251184], isArray: true })
  @IsArray()
  usuariosSolicitudesDocumentos: number[];
}
