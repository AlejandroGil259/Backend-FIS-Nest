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
  @Post('recuperar-contrasena')
  async recuperarContrasena(@Body('correo') correo: string): Promise<any> {
    // Implementa la lógica para generar el enlace de recuperación
    const enlaceRecuperacion = 'http://tu-app.com/recuperar-contrasena/123456';

    try {
      // Obtiene el usuario por correo
      const usuario = await this.authService.obtenerUsuarioPorCorreo(correo);

      // Si el usuario existe, envía el enlace de recuperación por correo
      if (usuario) {
        await this.authService.enviarCorreoRecuperacion(
          correo,
          enlaceRecuperacion,
        );

        return {
          mensaje:
            'Se ha enviado un enlace de recuperación a su correo electrónico.',
        };
      } else {
        // Puedes manejar el caso en el que el correo no está registrado
        return {
          mensaje: 'El correo proporcionado no está registrado.',
        };
      }
    } catch (error) {
      // Manejo de errores generales
      console.error(error);
      return {
        mensaje: 'Hubo un error al procesar la solicitud.',
      };
    }
  }
  // @ApiResponse({
  //   status: 200,
  //   description: 'Se encontro el usuario',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'No hay registros en la base de datos',
  // })
  // @Get('credenciales/:documento')
  // async obtenerCredenciales(@Param('documento') documento: number) {
  //   try {
  //     const credenciales = await this.authService.getCredentials(documento);
  //     return credenciales;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       return { mensaje: 'Usuario no encontrado' };
  //     }
  //     throw error;
  //   }
  // }

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
/**
 -------RECUPERAR CONTRASEÑA POR ENLACE ------ 
  @Post('recuperar-contrasena')
  async solicitarRestablecimientoContrasena(@Body() body: { correo: string }) {
    const usuario = await this.authService.obtenerPorCorreo(body.correo);

    if (usuario) {
      // Generar y enviar token de restablecimiento de contraseña
      const token =
        await this.authService.generarTokenRestablecimientoContrasena(usuario);
      await this.authService.enviarCorreoRestablecimientoContrasena(
        usuario.correo,
        token,
      );
    }

    // Puedes enviar una respuesta genérica para no revelar si el correo existe o no
    return { mensaje: 'Se ha enviado un correo si la cuenta existe.' };
  }

  @Post('restablecer-contrasena/:token')
  async restablecerContrasena(
    @Param('token') token: string,
    @Body() body: { nuevaContrasena: string },
  ) {
    await this.authService.restablecerContrasena(token, body.nuevaContrasena);
    return { mensaje: 'Contraseña restablecida con éxito.' };
  }


---CREDENCIALES POR TOKEN ------- 
   @Get('obtener-credenciales-y-token/:documento')
  async obtenerCredencialesYToken(@Param('documento') documento: number) {
    try {
      const credencialesYToken =
        await this.authService.obtenerCredencialesYTokenPorDocumento(documento);
      return credencialesYToken;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { mensaje: 'Usuario no encontrado' };
      }
      throw error;
    }
  }
 */
