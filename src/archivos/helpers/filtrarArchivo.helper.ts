/* eslint-disable @typescript-eslint/ban-types */

export const filtrarArchivo = (
  req: Express.Request,
  archivo: Express.Multer.File,
  callback: Function,
) => {
  // console.log({ archivo });
  if (!archivo) return callback(new Error('El archivo esta vacio'), false);

  const extensionArchivo = archivo.mimetype.split('/')[1];
  const extensionValida = ['pdf', '.docx'];

  if (extensionValida.includes(extensionArchivo)) {
    return callback(null, true);
  }
  callback(null, false);
};
