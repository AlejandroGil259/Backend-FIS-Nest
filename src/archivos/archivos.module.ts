import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivosController } from './archivos.controller';
import { ArchivosService } from './archivos.service';
import { Archivo } from './entities/archivo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Archivo])],
  controllers: [ArchivosController],
  providers: [ArchivosService],
})
export class ArchivosModule {}
