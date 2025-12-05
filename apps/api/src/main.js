import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const logger = new Logger('Bootstrap');
    // Security
    app.use(helmet());
    app.use(cookieParser());
    // CORS
    app.enableCors({
        origin: config.get('FRONTEND_URL') || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Skyzer Cloud API')
        .setDescription('Game Hosting Platform API')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    })
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    const port = config.get('API_PORT') || 3001;
    await app.listen(port);
    logger.log(`🚀 Skyzer Cloud API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map