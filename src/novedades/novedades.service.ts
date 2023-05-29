import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBExceptionService } from 'src/commons/services/db-exception.service';
import { Repository } from 'typeorm';
import { CreateNovedadesDto } from './dto/create-novedades.dto';
import { UpdateNovedadeDto } from './dto/update-novedades.dto';
import { Novedades } from './entities/novedades.entity';

@Injectable()
export class NovedadesService {
    constructor (
        @InjectRepository( Novedades )
        private readonly novedadRepo: Repository<Novedades>,
    ) { }
    async create ( createNovedadDto: CreateNovedadesDto ) {
        try {
            const novelty = await this.novedadRepo.save( createNovedadDto );
            return {
                novedad: novelty,
            };
        } catch ( error ) {
            throw DBExceptionService.handleDBException( error );
        }
    }

    async findAll () {
        const novedades = await this.novedadRepo.find();

        if ( !novedades || novedades.length )
            throw new NotFoundException( 'No se encontraron resultados' );

        return novedades;
    }

    async findOne ( id: string ) {
        const novedad = await this.novedadRepo.findOneBy( { id } );

        if ( !novedad )
            throw new NotFoundException(
                `No se encontraron resultados para la novedad "${ id }"`,
            );

        return novedad;
    }

    async update ( id: string, updateNovedadeDto: UpdateNovedadeDto ) {
        const novedad = await this.novedadRepo.findOne( { where: { id } } );

        if ( !novedad ) throw new NotFoundException( 'Esta novedad no existe' );
        const actualizarNovedad = Object.assign( novedad, updateNovedadeDto );

        return await this.novedadRepo.save( actualizarNovedad );
    }
}
