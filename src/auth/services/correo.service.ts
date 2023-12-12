import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CorreoService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tu-correo@gmail.com',
        pass: 'tu-contrasena',
      },
    });
  }

  async enviarCorreo(
    destinatario: string,
    asunto: string,
    mensaje: string,
  ): Promise<void> {
    const opcionesCorreo = {
      from: 'tu-correo@gmail.com',
      to: destinatario,
      subject: asunto,
      text: mensaje,
    };

    await this.transporter.sendMail(opcionesCorreo);
  }
}
