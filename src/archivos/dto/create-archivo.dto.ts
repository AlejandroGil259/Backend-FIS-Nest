import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArchivoDto {
  @ApiProperty({ example: 'nombre archivo' })
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  originalname: string;
}
