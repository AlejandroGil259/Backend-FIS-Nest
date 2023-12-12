import { PartialType } from '@nestjs/swagger';
import { CreateEntregasDto } from './create-entregas.dto';

export class UpdateEntregasDto extends PartialType(CreateEntregasDto) {}
