import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../../commons/services/db-exception.service';
import { CreateUserDto, LoginUsuarioDto, UpdateUsuarioDto } from '../dto';
import { Usuario } from '../entities/usuarios.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsuariosProyectos } from '../entities/usuarios-proyectos.entity';
import { ROLES } from '../constants';
import { CorreoService } from './correo.service';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuarioProyectoRepo: Repository<UsuariosProyectos>,
    private readonly jwtService: JwtService,
    private readonly correoService: CorreoService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { contrasena, ...usuario } = createUserDto;

      if (createUserDto.rol) {
        usuario.rol = createUserDto.rol;
      } else {
        usuario.rol = ROLES.ESTUDIANTE;
      }

      const user = this.usuarioRepo.create({
        ...usuario,
        contrasena: this.encryptPassword(contrasena),
        // contrasena: bcrypt.hashSync(contrasena, 10),
      });

      console.log('Usuario creado:', user);
      await this.usuarioRepo.save(user);

      delete user.contrasena;

      //Crear JWT con información de autorización
      return {
        ...usuario,
        token: this.getJwtToken({
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          documento: usuario.documento,
          correo: usuario.correo,
          // contrasena: contrasena,
          rol: usuario.rol,
        }),
      };
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  private encryptPassword(contrasena: string): string {
    const claveSecreta = 'FisTrabajo2023';

    const cipher = crypto.createCipher('aes-256-cbc', claveSecreta);
    let encrypted = cipher.update(contrasena, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { contrasena, correo } = loginUsuarioDto;
    const usuario = await this.usuarioRepo.findOne({
      where: { correo },
      select: {
        correo: true,
        contrasena: true,
        documento: true,
        nombres: true,
        apellidos: true,
        rol: true,
      },
    });

    if (!usuario)
      throw new UnauthorizedException(
        'Las credenciales no son válidas (email)',
      );

    // const contrasenaValida = await bcrypt.compare(
    //   contrasena,
    //   usuario.contrasena,
    // );

    // if (!contrasenaValida) {
    //   throw new UnauthorizedException(
    //     'Las credenciales no son válidas (contraseña)',
    //   );
    // }

    const encryptedPassword = this.encryptPassword(contrasena);
    if (encryptedPassword !== usuario.contrasena) {
      throw new UnauthorizedException(
        'Las credenciales no son válidas (contraseña)',
      );
    }

    return {
      ...usuario,
      token: this.getJwtToken({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        documento: usuario.documento,
        correo: usuario.correo,
        //contrasena: usuario.contrasena,
        rol: usuario.rol,
      }),
    };
    // retornar el JWT de acceso
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async change(documento: number, nuevaContrasena: string): Promise<void> {
    const user = await this.usuarioRepo.findOne({ where: { documento } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    //const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const encryptedPassword = this.encryptPassword(nuevaContrasena);

    // Asigna la contraseña hasheada 
    user.contrasena = encryptedPassword;
    await this.usuarioRepo.save(user);
  }

  async findByCedulaWithSolicitudes(
    documento: number,
  ): Promise<Usuario | null> {
    return this.usuarioRepo
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.solicitudes', 'solicitud')
      .where('usuario.documento = :documento', { documento })
      .getOne();
  }

  async getCredentials(
    documento: number,
  ): Promise<{ correo: string; contrasena: string }> {
    const usuario = await this.usuarioRepo.findOne({
      where: { documento },
      select: {
        correo: true,
        contrasena: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      correo: usuario.correo,
      contrasena: this.decryptPassword(usuario.contrasena),
    };
  }

  private decryptPassword(contrasenaEncriptada: string): string {
    const claveSecreta = 'FisTrabajo2023'; // Cambiar por la misma clave usada para encriptar
    const decipher = crypto.createDecipher('aes-256-cbc', claveSecreta);
    let decrypted = decipher.update(contrasenaEncriptada, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async getTeachers(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      where: { rol: ROLES.DOCENTE },
      select: ['documento', 'nombres', 'apellidos'],
    });
  }
  async findAll() {
    const usuarios = await this.usuarioRepo.find();

    if (!usuarios || !usuarios.length)
      throw new NotFoundException('No se encontraron resultados');

    return usuarios;
  }

  async findOne(documento: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { documento } });

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
