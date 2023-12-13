import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RecuperacionService {
  generarToken(usuario: string): string {
    const token = jwt.sign({ usuario }, 'tu-secreto', { expiresIn: '1h' });
    return token;
  }
}
