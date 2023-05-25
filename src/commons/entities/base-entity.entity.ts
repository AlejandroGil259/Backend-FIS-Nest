import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @ApiProperty( { description: 'Fecha de creación del registro' } )
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty( { description: 'Fecha de actualización del registro' } )
    @UpdateDateColumn()
    updated_at: Date;

    @ApiProperty( { description: 'Fecha de eliminación/desactivación del registro' } )
    @DeleteDateColumn()
    deleted_at: Date;
}