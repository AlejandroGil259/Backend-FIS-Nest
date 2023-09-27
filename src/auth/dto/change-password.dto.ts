import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 2251184, type: Number })
  @IsNumber()
  documento: number;

  @ApiProperty({ example: 'Abc12345' })
  @IsString()
  @IsOptional()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener mínimo una letra mayúscula, una minúscula y un número',
  })
  nuevaContrasena: string;
}
