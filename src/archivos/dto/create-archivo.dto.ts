import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { DOC_STATUS } from '../constants';

export class CreateArchivoDto {
  @ApiProperty({ uniqueItems: true, example: 'pdf, word' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'pdf, word' })
  @IsString()
  nombreArchivoOriginal: string;

  @ApiProperty({ example: 'pdf, word' })
  @IsString()
  nombreArchivoServidor: string;

  @ApiProperty({ example: 'SergioG' })
  @IsString()
  autor: string;

  @ApiProperty({
    description: 'Estado del archivo en la plataforma',
    enum: DOC_STATUS,
  })
  @IsEnum(DOC_STATUS)
  estado: DOC_STATUS;
}
