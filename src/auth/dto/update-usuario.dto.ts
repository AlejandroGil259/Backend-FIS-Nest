import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUserDto) {}
