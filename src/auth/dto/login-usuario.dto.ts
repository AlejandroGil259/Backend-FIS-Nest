import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'example@usantoto.edu.co' })
  @IsString()
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'Max-10' })
  @IsString()
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener mínimo una letra mayúscula, una minúscula y un número',
  })
  contrasena: string;
}
