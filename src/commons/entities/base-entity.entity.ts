import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @ApiProperty( { description: 'Fecha de creación del registro' } )
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty( { description: 'Fecha de actualización del registro' } )
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty( { description: 'Fecha de eliminación/desactivación del registro' } )
    @DeleteDateColumn()
    deletedAt: Date;
}