import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { NIVELFORMACION, SEDES } from '../constants';

export class CreateEspaciosCoterminaleDto {
  @ApiProperty({ example: 'Especialización', enum: SEDES })
  @IsEnum(NIVELFORMACION)
  nivelFormacion: NIVELFORMACION;

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
}
