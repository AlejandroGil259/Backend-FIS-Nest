import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Archivo } from './entities/archivo.entity';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';

import { EntregasService } from '../entregas/entregas.service';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Archivo]),
    AuthModule,
    SharedModule,
  ],
  controllers: [ArchivosController],
  providers: [ArchivosService, EntregasService],
})
export class ArchivosModule {}
