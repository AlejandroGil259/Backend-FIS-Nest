import { PartialType } from '@nestjs/swagger';
import { CreateNotificacionesDto } from './create-notificaciones.dto';

export class UpdateNotificacioneDto extends PartialType(
  CreateNotificacionesDto,
) {}
