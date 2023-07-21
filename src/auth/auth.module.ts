import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { UsuariosProyectos } from './entities/usuarios-proyectos.entity';
import { Usuario } from './entities/usuarios.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, UsuariosProyectos]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
