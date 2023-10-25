/* eslint-disable @typescript-eslint/ban-types */

export const filtrarArchivo = (
  req: Express.Request,
  archivo: Express.Multer.File,
  callback: Function,
) => {
  // console.log({ archivo });
  if (!archivo) return callback(new Error('El archivo esta vacio'), false);

  const extensionArchivo = archivo.mimetype.split('/')[1];
  const tipoMIME = archivo.mimetype;

  const extensionValida = ['pdf', 'docx'];
  const tiposMIMEValidos = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (
    extensionValida.includes(extensionArchivo) ||
    tiposMIMEValidos.includes(tipoMIME)
  ) {
    return callback(null, true);
  }
  callback(null, false);
};
