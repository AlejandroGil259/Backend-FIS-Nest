import { PartialType } from '@nestjs/swagger';
import { CreateNovedadesDto } from './create-novedades.dto';

export class UpdateNovedadeDto extends PartialType(CreateNovedadesDto) {}
