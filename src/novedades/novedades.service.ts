import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBExceptionService } from 'src/commons/services/db-exception.service';
import { In, Repository } from 'typeorm';
import { CreateNovedadesDto } from './dto/create-novedades.dto';
import { UpdateNovedadeDto } from './dto/update-novedades.dto';
import { Novedad } from './entities/novedad.entity';
import { Notificacion } from '../notificaciones/entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';

@Injectable()
export class NovedadesService {
    constructor (
        @InjectRepository( Novedad )
        private readonly novedadRepo: Repository<Novedad>,
        @InjectRepository( Notificacion )
        private readonly notificacionRepo: Repository<Notificacion>,
        @InjectRepository( Usuario )
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    async create ( createNovedadDto: CreateNovedadesDto ) {
        try {
            const novedad = await this.novedadRepo.save( createNovedadDto );

            const usuariosReceptores = await this.usuarioRepo.findBy( {
                documento: In( createNovedadDto.usuariosReceptoresDocumentos )
            } );

            const notificacion = await this.notificacionRepo.save( {
                ...createNovedadDto, novedad, usuariosReceptores
            } );

            return { notificacion };
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
        const novedad = await this.novedadRepo.findOneBy( { id } );
        if ( !novedad )
            return new NotFoundException(
                `No se encontró ninguna novedad con el Id ${ id }`,
            );

        try {
            return await this.novedadRepo.update( { id }, { ...updateNovedadeDto } );
        } catch ( error ) {
            throw DBExceptionService.handleDBException( error );
        }
    }
}
