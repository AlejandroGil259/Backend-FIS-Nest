import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novedades } from './entities/novedades.entity';
import { NovedadesController } from './novedades.controller';
import { NovedadesService } from './novedades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Novedades])],
  controllers: [NovedadesController],
  providers: [NovedadesService],
})
export class NovedadesModule {}
