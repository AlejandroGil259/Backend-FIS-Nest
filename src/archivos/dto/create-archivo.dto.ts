import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateArchivoDto {

  @ApiProperty({ example: 'pdf, word' })
  @IsString()
  extensionArchivo: string;
}
