import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { OPCION_GRADO } from '../constants';

export class CreateProyectoDto {
  @ApiProperty({ description: 'Referencia del proyecto', example: 'Fis01' })
  @IsOptional()
  @IsString()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @IsEnum(OPCION_GRADO)
  opcionGrado: OPCION_GRADO;

  @ApiProperty({
    description: 'Titulo del proyecto',
    example: 'Gestor Documentacion',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Documento del usuario que crea el proyecto',
    example: 123456789,
  })
  @IsNumber()
  usuarioDocumento: number;

  @ApiProperty({ description: '?????', example: '-----' })
  @IsString()
  archivoProyecto: string;
}
