import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../../commons/services/db-exception.service';
import { CreateUserDto, UpdateUsuarioDto, LoginUsuarioDto } from '../dto';
import { Usuario } from '../entities/usuarios.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { contrasena, ...usuario } = createUserDto;

      const user = this.usuarioRepo.create({
        ...usuario,
        contrasena: bcrypt.hashSync(contrasena, 10),
      });

      await this.usuarioRepo.save(user);

      delete user.contrasena;

      // TODO: Crear JWT con información de autorización

      return {
        usuario: user,
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { contrasena, correo } = loginUsuarioDto;
    const usuario = await this.usuarioRepo.findOne({
      where: { correo },
      select: { correo: true, contrasena: true },
    });

    if (!usuario)
      throw new UnauthorizedException('Credinciales no son validas (email)');

    if (!bcrypt.compareSync(contrasena, usuario.contrasena))
      throw new UnauthorizedException(
        'Credinciales no son validas (contraseña)',
      );

    return usuario;

    // TODO: retornar el JWT de acceso
  }

  async findAll() {
    const usuarios = await this.usuarioRepo.find();

    if (!usuarios || !usuarios.length)
      throw new NotFoundException('No se encontraron resultados');

    return usuarios;
  }

  async findOne(documento: number) {
    const usuario = await this.usuarioRepo.findOneBy({ documento });

    if (!usuario)
      throw new NotFoundException(
        `No se encontraron resultados para el documento "${documento}"`,
      );

    return usuario;
  }

  async findBy({ key, value }: { key: keyof CreateUserDto; value: any }) {
    try {
      const usuario: Usuario = await this.usuarioRepo
        .createQueryBuilder('usuario')
        .addSelect('usuario.contrasena')
        .where({ [key]: value })
        .getOne();

      return usuario;
    } catch (error) {}
  }

  async update(documento: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOneBy({ documento });
    if (!usuario)
      return new NotFoundException(
        `No se encontró un usuario con el documento ${documento}`,
      );
    try {
      return await this.usuarioRepo.update(
        { documento },
        { ...updateUsuarioDto },
      );
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async desactivate(documento: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
      withDeleted: false,
    });

    if (!usuario)
      throw new NotFoundException(
        `El usuario con el documento ${documento}, ya se encuentra eliminado o no existe en la base de datos`,
      );

    const { affected } = await this.usuarioRepo.update(
      { documento },
      {
        estado: false,
        deletedAt: new Date(),
      },
    );

    if (!affected || affected === 0)
      throw new BadRequestException(
        `No se pudo eliminar el usuario con el documento ${documento}`,
      );

    return 'El usuario fue eliminado/desactivado correctamente';
  }

  async restore(documento: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
      withDeleted: true,
    });

    if (!usuario)
      throw new NotFoundException(
        `No se encontró un usuario con el documento ${documento} `,
      );

    if (usuario.estado)
      throw new BadRequestException(
        `El usuario con el documento ${documento} ya se encuentra activo`,
      );

    const { affected } = await this.usuarioRepo.update(
      { documento },
      {
        estado: true,
        deletedAt: null,
      },
    );

    if (!affected || affected === 0)
      throw new BadRequestException(
        `No se pudo activar el usuario con el documento ${documento}`,
      );

    return 'El usuario fue restaurado/activado correctamente';
  }

  async remove(documento: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
      withDeleted: true,
    });

    if (!usuario)
      throw new NotFoundException(
        `No se encontró un usuario con el documento ${documento} `,
      );

    return await this.usuarioRepo.remove(usuario);
  }
}
