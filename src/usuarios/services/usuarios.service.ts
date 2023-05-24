import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
  getHello(): string {
    return 'Hello Sergio!';
  }
}
