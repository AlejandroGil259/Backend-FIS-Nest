import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entregas } from './entities/entregas.entity';
import { EntregasController } from './entregas.controller';
import { EntregasService } from './entregas.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entregas]), AuthModule, SharedModule],
  controllers: [EntregasController],
  providers: [EntregasService],
  exports: [EntregasService],
})
export class EntregasModule {}
