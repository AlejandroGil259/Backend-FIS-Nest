import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginUsuarioDto,
  UpdateUsuarioDto,
  ChangePasswordDto,
} from '../dto';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../entities/usuarios.entity';
@ApiTags('Usuarios')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Se creo correctamente el usuario en la base de datos',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo de manera correcta la petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post('registro')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Ingreso correctamente el usuario',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no realizo de manera correcta la petición',
  })
  @ApiResponse({
    status: 500,
    description: 'Error en el servidor, puede ser culpa del código o de la DB',
  })
  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login(loginUsuarioDto);
  }

  @Post('cambiarContrasena')
  async change(@Body() changePasswordDto: ChangePasswordDto) {
    const { documento, nuevaContrasena } = changePasswordDto;

    try {
      await this.authService.change(documento, nuevaContrasena);
      return { message: 'Contraseña cambiada con éxito' };
    } catch (error) {
      // Maneja los errores apropiadamente, por ejemplo, si el usuario no existe
      return {
        error: 'No se pudo cambiar la contraseña',
        message: error.message,
      };
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontro el Docente',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Get('docentes')
  async obtenerDocentes(): Promise<Usuario[]> {
    return this.authService.getTeachers();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontro el usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Get('credenciales/:documento')
  async obtenerCredenciales(@Param('documento') documento: number) {
    try {
      const credenciales = await this.authService.getCredentials(documento);
      return credenciales;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { mensaje: 'Usuario no encontrado' };
      }
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontraron registros',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró un registro con el documento ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para ese documento',
  })
  @ApiParam({
    name: 'documento',
    description: 'Documento del usuario registrado',
    example: 123456789,
  })
  @Get(':documento')
  findOne(@Param('documento', ParseIntPipe) documento: number) {
    return this.authService.findOne(documento);
  }

  @ApiResponse({
    status: 200,
    description: 'Se encontró un registro con el documento ingresado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para ese documento',
  })
  @ApiParam({
    name: 'documento',
    description: 'Documento del usuario registrado',
    example: 123456789,
  })
  @Get('solicitudes/buscar/:documento')
  async findUsuarioByCedula(@Param('documento', ParseIntPipe) documento) {
    const usuario = await this.authService.findByCedulaWithSolicitudes(
      documento,
    );
    return usuario;
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado el usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos para este usuario',
  })
  @Patch(':documento')
  update(
    @Param('documento', ParseIntPipe) documento: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.authService.update(documento, updateUsuarioDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado el usuario',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se pudo eliminar el usuario por que ya se encuentra inactivo o por error en la consulta',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Delete('desactivar/:documento')
  deactivate(@Param('documento', ParseIntPipe) documento: number) {
    return this.authService.desactivate(documento);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha restaurado el usuario',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se pudo restaurar el usuario por que ya se encuentra activo o por error en la consulta',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Patch('restore/:documento')
  restore(@Param('documento', ParseIntPipe) documento: number) {
    return this.authService.restore(documento);
  }

  @ApiResponse({
    status: 200,
    description: 'Se ha eliminado el usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay registros en la base de datos',
  })
  @Delete(':documento')
  remove(@Param('documento', ParseIntPipe) documento: number) {
    return this.authService.remove(documento);
  }
}
