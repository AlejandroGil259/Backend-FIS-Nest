import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ESTADO_ENTREGAS, TIPO_ENTREGA } from '../constants';

export class CreateEntregasDto {
  @ApiProperty({ enum: TIPO_ENTREGA })
  @IsEnum(TIPO_ENTREGA)
  tipoEntrega: TIPO_ENTREGA;

  @ApiProperty({
    enum: ESTADO_ENTREGAS,
    description: 'Respuesta del estado de entregas',
    default: ESTADO_ENTREGAS.ENVIADO,
  })
  @IsOptional()
  @IsEnum(ESTADO_ENTREGAS)
  estado: ESTADO_ENTREGAS;

  @ApiProperty({
    example:
      'Hola buen dia, adjunto el proyecto con mi compañero Julian Duarte',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 'Nombre evaluador1' })
  @IsString()
  @IsOptional()
  evaluador1?: string;

  @ApiProperty({ example: 'Nombre evaluador2' })
  @IsString()
  @IsOptional()
  evaluador2?: string;

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

  @ApiProperty({
    description: 'Escribe aqui tu IdProyecto ',
    example: '0b77393d-95c6-45e4-a941-19db023bb623',
  })
  @IsString()
  idProyecto: string;
}
