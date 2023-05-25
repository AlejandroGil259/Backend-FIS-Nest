import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/entities/base-entity.entity';
import { Column, Entity } from 'typeorm';

@Entity('archivos')
export class Archivo extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
    type: 'integer',
  })
  id: number;

  @ApiProperty({ example: 'pdf, word' })
  @Column({
    name: 'nombre_archivo_original',
    type: 'varchar',
  })
  nombreArchivoOriginal: string;

  @ApiProperty({ example: 'pdf, word' })
  @Column({
    name: 'nombre_archivo_servidor',
    type: 'varchar',
  })
  nombreArchivoServidor: string;

  //FECHA CARGA

  @ApiProperty({ example: 'SergioG' })
  @Column()
  autor: string;

  @ApiProperty({
    description: 'Estado del archivo en la plataforma',
  })
  @Column({
    type: 'varchar',
  })
  estado: string;
}
