import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Usuario } from '../entities/usuarios.entity';
import { META_ROLES } from '../decorators/rol-protected.decorator';

@Injectable()
export class UsuarioRolGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validarRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validarRoles) return true;
    if (validarRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const usuario = req.user as Usuario;

    if (!usuario) throw new BadRequestException('Usuario no encontrado');

    for (const role of usuario.rol) {
      if (validarRoles.includes(role)) {
        return true;
      } 
    }
    throw new ForbiddenException(
      `El usuario ${usuario.nombres} ${usuario.apellidos} necesita un rol valido: [${validarRoles}]`,
    );
  }
}
