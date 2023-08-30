import { UseGuards, applyDecorators } from '@nestjs/common';
import { RolProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioRolGuard } from '../guards/usuario-rol.guard';
import { ValidarRoles } from '../interfaces';

export function Auth(...roles: ValidarRoles[]) {
  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UsuarioRolGuard),
  );
}
