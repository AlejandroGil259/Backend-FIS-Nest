import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CorreoService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        type: 'OAuth2',
        user: 'tucorreo@outlook.com',
        clientId: '0a068aad-5ff3-48f5-ace1-a56da66587f7',
        clientSecret: '3a2558bd-cc5b-4cf4-9cac-0e047050e682',
        refreshToken: 'tu-refresh-token',
        accessToken: 'tu-access-token',
        expires: 3599,
      },
    });
  }

  async enviarCorreo(
    destinatario: string,
    asunto: string,
    mensaje: string,
  ): Promise<void> {
    const opcionesCorreo = {
      from: 'tucorreo@outlook.com',
      to: destinatario,
      subject: asunto,
      text: mensaje,
    };

    await this.transporter.sendMail(opcionesCorreo);
  }
}
