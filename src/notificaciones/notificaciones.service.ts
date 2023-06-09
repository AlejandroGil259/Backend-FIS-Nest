import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DBExceptionService } from '../commons/services/db-exception.service';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';

@Injectable()
export class NotificacionesService {
    constructor (
        @InjectRepository( Notificacion )
        private readonly notificacionRepo: Repository<Notificacion>,
        @InjectRepository( Usuario )
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    async create ( createNotificacionDto: CreateNotificacionesDto ) {
        const { usuariosReceptoresDocumentos: usuariosReceptoresDocumento } = createNotificacionDto;

        try {
            const usuariosReceptores = await this.usuarioRepo.findBy( {
                documento: In( usuariosReceptoresDocumento )
            } );

            const notificacion = await this.notificacionRepo.save(
                { ...createNotificacionDto, usuariosReceptores }
            );

            return { notificacion };
        } catch ( error ) {
            throw DBExceptionService.handleDBException( error );
        }
    }

    async findAll () {
        const notificaciones = await this.notificacionRepo.find();

        if ( !notificaciones || !notificaciones.length )
            throw new NotFoundException( 'No se encontraron resultados' );

        return notificaciones;
    }

    async findOne ( id: string ) {
        const notificacion = await this.notificacionRepo.findOneBy( { id } );

        if ( !notificacion )
            throw new NotFoundException(
                `No se encontraron resultados para notificacion "${ id }"`,
            );

        return notificacion;
    }
}
