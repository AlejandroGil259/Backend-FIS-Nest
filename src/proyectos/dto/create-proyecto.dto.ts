import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { CODIRECTOR, DIRECTOR, OPCION_GRADO, TIPO_ENTREGA } from '../constants';

export class CreateProyectoDto {
  @ApiProperty({ description: 'Referencia del proyecto', example: 'Fis01' })
  @IsOptional()
  @IsString()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @IsEnum(OPCION_GRADO)
  opcionGrado: OPCION_GRADO;

  @ApiProperty({ enum: TIPO_ENTREGA })
  @IsEnum(TIPO_ENTREGA)
  tipoEntrega: TIPO_ENTREGA;

  @ApiProperty({
    description: 'Nombre del director',
    enum: DIRECTOR,
  })
  @IsEnum(DIRECTOR)
  director: DIRECTOR;

  @ApiProperty({
    description: 'Nombre del codirector',
    enum: CODIRECTOR,
  })
  @IsOptional()
  @IsEnum(CODIRECTOR)
  codirector?: CODIRECTOR;

  @ApiProperty({
    description: 'Titulo del proyecto',
    example: 'Gestor Documentacion',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'descripcion',
    example:
      'Hola buen dia, adjunto el proyecto con mi compañero Julian Duarte',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

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
