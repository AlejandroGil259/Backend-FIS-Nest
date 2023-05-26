import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-usuario.dto';
import { DBExceptionService } from '../../commons/services/db-exception.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor ( @InjectRepository( Usuario ) private readonly usuarioRepo: Repository<Usuario> ) { }

    async register ( createUserDto: CreateUserDto ) {
        try {
            const { contrasena, ...usuario } = createUserDto;

            delete usuario.estado;
            delete usuario.comite;

            const user = this.usuarioRepo.create( {
                ...usuario,
                contrasena: bcrypt.hashSync( contrasena, 10 )
            } );

            await this.usuarioRepo.save( user );

            delete user.contrasena;

            // TODO: Crear JWT con información de autorización

            return {
                usuario: user
            };
        } catch ( error ) {
            throw DBExceptionService.handleDBException( error );
        }
    }

    async findAll () {
        const usuarios = await this.usuarioRepo.find();

        if ( !usuarios || !usuarios.length ) throw new NotFoundException( 'No se encontraron resultados' );

        return usuarios;
    }

    async findOne ( documento: number ) {
        const usuario = await this.usuarioRepo.findOneBy( { documento } );

        if ( !usuario ) throw new NotFoundException( `No se encontraron resultados para el documento "${ documento }"` );

        return usuario;
    }
}
