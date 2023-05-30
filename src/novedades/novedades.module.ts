import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novedad } from './entities/novedad.entity';
import { NovedadesController } from './novedades.controller';
import { NovedadesService } from './novedades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Novedad])],
  controllers: [NovedadesController],
  providers: [NovedadesService],
})
export class NovedadesModule {}
