import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap () {
    const app = await NestFactory.create( AppModule );

    // Salidas en consola y uso de variables de entorno
    const logger = new Logger( 'Bootstrap' );
    const configService = new ConfigService();

    // Establecer que siembre se use la palabra `api` en las peticiones
    app.setGlobalPrefix( 'api' );

    // Restringir y purificar los campos que envía el usuario en la petición
    app.useGlobalPipes(
        new ValidationPipe( {
            whitelist: true,
            forbidNonWhitelisted: true
        } )
    );

    // Uso de Swagger para documentación interactiva: http://localhost:3000/docs
    const swaggerConfig = new DocumentBuilder()
        .setTitle( 'Gestión Documental Proyectos de Grado - FIS' )
        .setDescription( 'Documentación visual e interactiva de los endpoints del proyecto' )
        .setVersion( '1.0' )
        .build();

    const document = SwaggerModule.createDocument( app, swaggerConfig );
    SwaggerModule.setup( 'docs', app, document );

    await app.listen( configService.get( 'PORT' ) );

    logger.log( `>> Aplicación corriendo en: ${ await app.getUrl() }` );
}
bootstrap();
