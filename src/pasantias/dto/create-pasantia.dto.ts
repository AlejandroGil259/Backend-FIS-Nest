import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePasantiaDto {
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

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  usuarioPasantiaCedula: number;
}
