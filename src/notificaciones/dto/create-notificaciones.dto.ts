import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { TIPO_NOTIFICACION } from '../constansts';

export class CreateNotificacionesDto {
  @ApiProperty({ example: '01-01-2023' })
  @IsDate()
  fechaNotificacion: Date;

  @ApiProperty({ example: '123456789' })
  @IsNumber()
  usuarioEnvio: number;

  @ApiProperty({ example: 'Titulo de la notificación' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'descripcion' })
  @IsString()
  descripcion: string;

  @ApiProperty({
    enum: TIPO_NOTIFICACION,
  })
  @IsEnum(TIPO_NOTIFICACION)
  tipoNotificacion: TIPO_NOTIFICACION;
}
