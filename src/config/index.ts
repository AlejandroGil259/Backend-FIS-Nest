import * as Joi from 'joi';

// Validar y respaldar las variables de entorno
export const JoiValidationSchema = Joi.object( {
    PORT: Joi.number().required().default( 3000 ),
    DB_HOST: Joi.required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.required(),
    DB_PASSWORD: Joi.required(),
    DB_NAME: Joi.required(),
} );