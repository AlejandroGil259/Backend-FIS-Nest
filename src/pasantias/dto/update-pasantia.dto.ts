import { PartialType } from '@nestjs/swagger';
import { CreatePasantiaDto } from './create-pasantia.dto';

export class UpdatePasantiaDto extends PartialType(CreatePasantiaDto) {}
