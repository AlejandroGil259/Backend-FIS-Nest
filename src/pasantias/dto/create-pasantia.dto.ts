import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePasantiaDto {
  // @ApiProperty({
  //   description: 'IdProyecto',
  //   example: '6ac6b17d-3466-45a4-a76e-f092c155037d',
  // })
  // @IsString()
  // idProyecto: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  @IsString()
  nombreEmpresa: string;

  @ApiProperty({ type: Date, example: new Date().toISOString() })
  @IsDateString()
  fechaInicio: Date;

  @ApiProperty({ type: Date, example: new Date().toISOString() })
  @IsDateString()
  @IsOptional()
  fechaFin: Date;

  @ApiProperty({
    description: 'Ubicacion de la empresa',
    example: 'Tunja, Boyacá',
  })
  @IsString()
  ubicacion: string;
}
