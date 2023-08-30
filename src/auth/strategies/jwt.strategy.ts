import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuarios.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    const { correo } = payload;

    const usuario = await this.usuarioRepositorio.findOneBy({ correo });

    if (!usuario) throw new UnauthorizedException('Token no valido');

    if (!usuario.estado)
      throw new UnauthorizedException(
        'Usuario no esta activo, habla con el admin',
      );

    console.log({ usuario });

    return usuario;
  }
}
