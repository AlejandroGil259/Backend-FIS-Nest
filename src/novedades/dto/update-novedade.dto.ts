import { PartialType } from '@nestjs/swagger';
import { CreateNovedadeDto } from './create-novedade.dto';

export class UpdateNovedadeDto extends PartialType(CreateNovedadeDto) {}
