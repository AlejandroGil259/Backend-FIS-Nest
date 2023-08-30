import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUsuario = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    
    const req = ctx.switchToHttp().getRequest();
    const usuario = req.user;

    if (!usuario)
      throw new InternalServerErrorException('user not found (request)');

    return (!data) ? usuario: usuario[data];
  },
);
