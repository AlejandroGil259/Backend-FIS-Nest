import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { OPCION_GRADO } from '../constants';

export class CreateProyectoDto {
  @ApiProperty({ description: 'Referencia del proyecto' })
  @IsOptional()
  @IsString()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @IsEnum(OPCION_GRADO)
  opcionGrado: OPCION_GRADO;

  @ApiProperty({ description: 'Titulo del proyecto' })
  @IsString()
  titulo: string;
}
