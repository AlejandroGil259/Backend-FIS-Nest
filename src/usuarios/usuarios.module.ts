import { Module } from '@nestjs/common';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario, UsuariosNotificaciones } from './entities/usuarios.entity';
import { UsuariosProyectos } from './entities/usuarios-proyectos.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Usuario,
      UsuariosNotificaciones,
      UsuariosProyectos,
    ]),
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
