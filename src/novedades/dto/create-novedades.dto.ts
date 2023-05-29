import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { TIPO_NOVEDAD } from '../constansts';

export class CreateNovedadesDto {
  @ApiProperty({ example: 'Número de Acta' })
  @IsString()
  numActa: string;

  @ApiProperty({ type: Date, example: '01-01-2023' })
  @IsDateString()
  fechaActa: Date;

  @ApiProperty({
    enum: TIPO_NOVEDAD,
  })
  @IsEnum(TIPO_NOVEDAD)
  tipoNovedad: TIPO_NOVEDAD;

  @ApiProperty({ example: 'Respuesta' })
  @IsString()
  respuesta: string;

  @ApiProperty({ example: 'Observaciones' })
  @IsString()
  observaciones: string;
}
