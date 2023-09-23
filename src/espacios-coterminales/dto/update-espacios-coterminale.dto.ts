import { PartialType } from '@nestjs/swagger';
import { CreateEspaciosCoterminaleDto } from './create-espacios-coterminale.dto';

export class UpdateEspaciosCoterminaleDto extends PartialType(CreateEspaciosCoterminaleDto) {}
