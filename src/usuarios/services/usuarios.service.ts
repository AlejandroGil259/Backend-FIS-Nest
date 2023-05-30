import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../../commons/services/db-exception.service';
import { CreateUserDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuarios.entity';

@Injectable()
export class UsuariosService {
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

  async findAll() {
    const usuarios = await this.usuarioRepo.find();

    if (!usuarios || !usuarios.length)
      throw new NotFoundException('No se encontraron resultados');

    return usuarios;
  }

  async findOne(documento: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
      relations: { solicitudes: true },
    });

    if (!usuario)
      throw new NotFoundException(
        `No se encontraron resultados para el documento "${documento}"`,
      );

    return usuario;
  }

  async update(documento: number, updateUsuarioDto: UpdateUsuarioDto) {
    // const usuario = await this.usuarioRepo.findOne({
    //   where: { documento },
    // });

    // if (!usuario) {
    //   throw new NotFoundException('Este usuario no existe');
    // }

    // const actualizarUsuario = {
    //   ...usuario,
    //   ...updateUsuarioDto,
    // };

    // return await this.usuarioRepo.save(actualizarUsuario);

    const usuario = await this.usuarioRepo.findOne({ where: { documento } });

    if (!usuario) throw new NotFoundException('Este usuario no existe');
    const actualizarUsuario = Object.assign(usuario, updateUsuarioDto);

    return await this.usuarioRepo.save(actualizarUsuario);
  }

  async remove(documento: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
    });

    if (!usuario) {
      throw new NotFoundException('Este usuario no existe');
    }

    await this.usuarioRepo.remove(usuario);
  }
}
