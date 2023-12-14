import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ESTADO_RESPUESTA_PROYECTOS, OPCION_GRADO } from '../constants';

export class CreateProyectoDto {
  @ApiProperty({
    enum: ESTADO_RESPUESTA_PROYECTOS,
    description: 'Respuesta del estado del proyecto',
  })
  @IsOptional()
  @IsEnum(ESTADO_RESPUESTA_PROYECTOS)
  estado?: ESTADO_RESPUESTA_PROYECTOS;

  @ApiProperty({ enum: OPCION_GRADO })
  @IsEnum(OPCION_GRADO)
  opcionGrado: OPCION_GRADO;

  @ApiProperty({
    description: 'Titulo del proyecto',
    example: 'Gestor Documentacion',
  })
  @IsString()
  tituloVigente: string;

  @ApiProperty({
    description: 'Documento del usuario que crea el proyecto',
    example: 123456789,
  })
  @IsNumber()
  usuarioDocumento: number;

  @ApiProperty({ description: 'Archivo adjunto al proyecto', example: '-----' })
  @IsString()
  archivoProyecto: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  director?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  codirector?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  segundoAutor?: string;
}
