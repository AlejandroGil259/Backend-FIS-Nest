import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUserDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@ApiTags( 'Usuarios' )
@Controller( 'usuarios' )
export class UsuariosController {
    constructor ( private readonly usuariosService: UsuariosService ) { }

    @ApiResponse( {
        status: 201,
        description: 'Se creo correctamente el usuario en la base de datos',
    } )
    @ApiResponse( {
        status: 400,
        description: 'El usuario no realizo de manera correcta la petición',
    } )
    @ApiResponse( {
        status: 500,
        description: 'Error en el servidor, puede ser culpa del código o de la DB',
    } )
    @Post( 'registro' )
    register ( @Body() createUserDto: CreateUserDto ) {
        return this.usuariosService.register( createUserDto );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se encontraron registros',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos',
    } )
    @Get()
    findAll () {
        return this.usuariosService.findAll();
    }

    @ApiResponse( {
        status: 200,
        description: 'Se encontró un registro con el documento ingresado',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos para ese documento',
    } )
    @ApiParam( {
        name: 'documento',
        description: 'Documento del usuario registrado',
        example: 123456789,
    } )
    @Get( ':documento' )
    findOne ( @Param( 'documento', ParseIntPipe ) documento: number ) {
        return this.usuariosService.findOne( documento );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se ha actualizado el usuario',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos para este usuario',
    } )
    @Patch( ':documento' )
    update (
        @Param( 'documento', ParseIntPipe ) documento: number,
        @Body() updateUsuarioDto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.update( documento, updateUsuarioDto );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se ha eliminado el usuario',
    } )
    @ApiResponse( {
        status: 400,
        description: 'No se pudo eliminar el usuario por que ya se encuentra inactivo o por error en la consulta',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos',
    } )
    @Delete( 'desactivar/:documento' )
    deactivate ( @Param( 'documento', ParseIntPipe ) documento: number ) {
        return this.usuariosService.deactivate( documento );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se ha restaurado el usuario',
    } )
    @ApiResponse( {
        status: 400,
        description: 'No se pudo restaurar el usuario por que ya se encuentra activo o por error en la consulta',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos',
    } )
    @Patch( 'restore/:documento' )
    restore ( @Param( 'documento', ParseIntPipe ) documento: number ) {
        return this.usuariosService.restore( documento );
    }

    @ApiResponse( {
        status: 200,
        description: 'Se ha eliminado el usuario',
    } )
    @ApiResponse( {
        status: 404,
        description: 'No hay registros en la base de datos',
    } )
    @Delete( ':documento' )
    remove ( @Param( 'documento', ParseIntPipe ) documento: number ) {
        return this.usuariosService.remove( documento );
    }
}
