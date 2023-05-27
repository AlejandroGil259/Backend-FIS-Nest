import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUserDto } from '../dto/create-usuario.dto';

@ApiTags( 'Usuarios' )
@Controller( 'usuarios' )
export class UsuariosController {
    constructor ( private readonly usuariosService: UsuariosService ) { }

    @ApiResponse( {
        status: 201,
        description: 'Se creo correctamente el usuario en la base de datos'
    } )
    @ApiResponse( {
        status: 400,
        description: 'El usuario no realizo de manera correcta la petición'
    } )
    @ApiResponse( {
        status: 500,
        description: 'Error en el servidor, puede ser culpa del código o de la DB'
    } )
    @Post( 'registro' )
    register ( @Body() createUserDto: CreateUserDto ) {
        return this.usuariosService.register( createUserDto );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se encontraron registros'
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos'
    } )
    @Get()
    findAll () {
        return this.usuariosService.findAll();
    }

    @ApiResponse( {
        status: 200,
        description: 'Se encontró un registro con el documento ingresado'
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos para ese documento'
    } )
    @ApiParam( {
        name: 'documento',
        description: 'Documento del usuario registrado',
        example: 123456789
    } )
    @Get( ':documento' )
    findOne ( @Param( 'documento', ParseIntPipe ) documento: number ) {
        return this.usuariosService.findOne( documento );
    }
}