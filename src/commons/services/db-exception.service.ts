import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PostgreSQLErrorCodes } from '../constansts';

@Injectable()
export class DBExceptionService {
    private static logger = new Logger( 'DBExceptionService' );

    public static handleDBException ( error: any ): never {
        if (
            error.code === PostgreSQLErrorCodes.NOT_NULL_VIOLATION
            || error.code === PostgreSQLErrorCodes.UNIQUE_VIOLATION
        ) {
            throw new BadRequestException( error.detail );
        }

        if ( error.code === PostgreSQLErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE ) {
            throw new BadRequestException( error );
        }

        this.logger.error( error );
        console.log( error );
        throw new InternalServerErrorException( 'Error inesperado, comuníquese con el administrador del servidor' );
    }
}