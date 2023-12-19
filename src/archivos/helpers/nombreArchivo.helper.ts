/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuid } from 'uuid';

export const nombreArchivo = (
  req: Express.Request,
  archivo: Express.Multer.File,
  callback: Function,
) => {
  if (!archivo) return callback(new Error('El archivo está vacío'), false);

  const extensionArchivo = archivo.originalname.split('.').pop(); // Obtener la extensión desde el nombre original

  if (!extensionArchivo) {
    return callback(
      new Error('No se pudo determinar la extensión del archivo'),
      false,
    );
  }

  const nombreArchivo = `${uuid()}.${extensionArchivo}`;

  return callback(null, nombreArchivo);
};
