import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ROLES } from "../constants";

export class CreateUserDto {
    @ApiProperty( {
        uniqueItems: true,
        example: 123456789
    } )
    @IsNumber()
    documento: number;

    @ApiProperty( {
        example: 2251184,
        type: Number,
        description: 'Código del programa para el estudiante',
    } )
    @IsOptional()
    @IsNumber()
    codigo?: number;

    @ApiProperty( { enum: ROLES } )
    @IsOptional()
    @IsEnum( ROLES )
    rol: ROLES;

    @ApiProperty( { example: 'N.N' } )
    @IsString()
    nombres: string;

    @ApiProperty( { example: 'Rodriguez' } )
    @IsString()
    apellidos: string;

    @ApiProperty( { example: 'example@usantoto.edu.co' } )
    @IsString()
    @IsEmail()
    correo: string;

    @ApiProperty( { example: 'Max-10' } )
    @IsString()
    @MinLength( 6 )
    @MaxLength( 10 )
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener mínimo una letra mayúscula, una minúscula y un número'
    } )
    contrasena: string;

    @ApiProperty( {
        example: 20181,
        type: Number,
    } )
    @IsNumber()
    @IsOptional()
    periodoIngreso?: number;

    @ApiProperty( {
        description: 'Estado del usuario en la plataforma',
        default: true,
    } )
    @IsOptional()
    @IsBoolean()
    estado: boolean;

    @ApiProperty( {
        example: 3126650202,
        type: Number,
    } )
    @IsNumber()
    @IsOptional()
    telefono?: number;

    @ApiProperty( {
        description: 'Estado del docente en el comite y en la plataforma',
        default: false,
    } )
    @IsBoolean()
    comite: boolean;
}