import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateArchivoDto {
  @ApiProperty({ example: 'nombre archivo' })
  @IsString()
  nombreArchivo: string;

  @ApiProperty({ example: 'pdf, word (.docx .doc)' })
  @IsString()
  extensionArchivo: string;
}
