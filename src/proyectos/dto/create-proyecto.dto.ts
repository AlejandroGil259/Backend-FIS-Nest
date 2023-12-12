import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { ESTADO_RESPUESTA_PROYECTOS, OPCION_GRADO } from '../constants';

class RolProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apellidos: string;
}

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

  @ApiProperty({ description: '?????', example: '-----' })
  @IsString()
  archivoProyecto: string;

  @ApiProperty({
    description: 'Información del Docente (Rol Proyecto)',
    type: RolProyectoDto,
  })
  @IsObject()
  @IsNotEmpty()
  rolProyecto: RolProyectoDto;
}
