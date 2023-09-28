import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SEDES } from '../constants';

export class CreateEspaciosCoterminaleDto {
  @ApiProperty({ example: 1001, type: Number })
  @IsNumber()
  codigoPrograma: number;

  @ApiProperty({ description: 'Nombre del postgrado' })
  @IsString()
  nombrePrograma: string;

  @ApiProperty({
    description: 'Ubicacion de la Sede o seccional',
    example: 'Sede Bogotá',
    enum: SEDES,
  })
  @IsEnum(SEDES)
  institucion: SEDES;

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  usuariosEspacioCoCedula: number;
}
