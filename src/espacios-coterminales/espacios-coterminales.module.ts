import { Module } from '@nestjs/common';
import { EspaciosCoterminalesService } from './espacios-coterminales.service';
import { EspaciosCoterminalesController } from './espacios-coterminales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspaciosCoterminale } from './entities/espacios-coterminale.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EspaciosCoterminale]), AuthModule],
  controllers: [EspaciosCoterminalesController],
  providers: [EspaciosCoterminalesService],
})
export class EspaciosCoterminalesModule {}
