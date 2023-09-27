import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ROLES } from '../constants';

export class CreateUserDto {
  @ApiProperty({ example: 2251184, type: Number })
  @IsNumber()
  documento: number;

  @ApiProperty({
    example: 2251184,
    type: Number,
    description: 'Código del estudiante',
  })
  @IsOptional()
  @IsNumber()
  codigo?: number;

  @ApiProperty({ enum: ROLES })
  @IsOptional()
  @IsEnum(ROLES)
  rol: ROLES;

  @ApiProperty({ example: 'N.N' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Rodriguez' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: 'example@usantoto.edu.co' })
  @IsString()
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'Max-10' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener mínimo una letra mayúscula, una minúscula y un número',
  })
  contrasena: string;

  @ApiProperty({
    example: 20181,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  periodoIngreso?: number;

  @IsNumber()
  @IsOptional()
  telefono?: number;
}
