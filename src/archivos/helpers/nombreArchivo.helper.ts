/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuid } from 'uuid';

export const nombreArchivo = (
  req: Express.Request,
  archivo: Express.Multer.File,
  callback: Function,
) => {
  if (!archivo) return callback(new Error('El archivo esta vacio'), false);

  const extensionArchivo = archivo.mimetype.split('/')[1];

  const nombreArchivo = `${uuid()}.${extensionArchivo}`;

  return callback(null, nombreArchivo);
};
