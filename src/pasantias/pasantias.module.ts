import { Module } from '@nestjs/common';
import { PasantiasService } from './pasantias.service';
import { PasantiasController } from './pasantias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pasantia } from './entities/pasantia.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pasantia]), AuthModule],
  controllers: [PasantiasController],
  providers: [PasantiasService],
})
export class PasantiasModule {}
