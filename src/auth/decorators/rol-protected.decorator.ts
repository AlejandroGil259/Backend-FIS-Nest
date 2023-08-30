import { SetMetadata } from '@nestjs/common';
import { ValidarRoles } from '../interfaces';

export const META_ROLES = 'rol';
export const RolProtected = (...args: ValidarRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
