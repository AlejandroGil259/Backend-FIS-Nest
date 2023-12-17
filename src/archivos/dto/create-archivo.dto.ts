import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArchivoDto {
  @ApiProperty({ example: 'nombre archivo servidor' })
  @IsString()
  nombreArchivoServidor: string;

  @ApiProperty()
  @IsString()
  nombreArchivoOriginal: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rolOrigen?: string;

  @ApiProperty({
    description: 'Escribe aqui tu IdEntrega ',
    example: '0b77393d-95c6-45e4-a941-19db023bb623',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  idEntrega: string;

  @ApiProperty({
    description: 'Escribe aqui tu IdEntrega ',
    example: '0b77393d-95c6-45e4-a941-19db023bb623',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  idSolicitud: string;

  constructor(data: {
    idEntrega?: string;
    idSolicitud?: string;
    nombreArchivoServidor: string;
    nombreArchivoOriginal: string;
  }) {
    if (!data.idEntrega && !data.idSolicitud) {
      throw new Error('Se requiere al menos idEntrega o idSolicitud.');
    }
    this.idEntrega = data.idEntrega;
    this.idSolicitud = data.idSolicitud;
    this.nombreArchivoServidor = data.nombreArchivoServidor;
    this.nombreArchivoOriginal = data.nombreArchivoOriginal;
  }
}
