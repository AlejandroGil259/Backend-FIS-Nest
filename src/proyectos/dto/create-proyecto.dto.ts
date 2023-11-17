import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import {
  CODIRECTOR,
  DIRECTOR,
  ESTADO_RESPUESTA_PROYECTOS,
  OPCION_GRADO,
  TIPO_ENTREGA,
} from '../constants';

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

  @ApiProperty({ example: 'Nombre Segundo autor' })
  @IsString()
  @IsOptional()
  segundoAutor?: string;

  @ApiProperty({ example: 'Nombre evaluador1' })
  @IsString()
  @IsOptional()
  evaluador1?: string;

  @ApiProperty({ example: 'Nombre evaluador2' })
  @IsString()
  @IsOptional()
  evaluador2?: string;

  @ApiProperty({
    enum: ESTADO_RESPUESTA_PROYECTOS,
    description: 'Respuesta del estado del proyecto',
    default: ESTADO_RESPUESTA_PROYECTOS.ENVIADO,
  })
  @IsEnum(ESTADO_RESPUESTA_PROYECTOS)
  estado: ESTADO_RESPUESTA_PROYECTOS;
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
