import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({   // ✅ Enable global validation for all incoming requests
    whitelist: true,                       // - whitelist: remove fields not defined in DTO
    forbidNonWhitelisted: true,           // - forbidNonWhitelisted: throw error if extra fields are sent
    forbidUnknownValues: true,           // - forbidUnknownValues: reject invalid objects
  }));

  // ✅ Get port from environment file (.env.development or .env.production)
  const port = process.env.PORT || 3000;

  // ✅ Start the application on the specified port
  await app.listen(port);
}

// 🟡 Debug logs to verify environment variables loaded correctly
console.log('ENV:', process.env.NODE_ENV);       // Shows current environment (development or production)
console.log('DB:', process.env.DB_NAME);         // Shows which database name is being used
console.log('DB_HOST:', process.env.DB_HOST);    // Shows database host (localhost or prod host)
console.log('DB_PORT:', process.env.DB_PORT);    // Shows database port (usually 3306 for MySQL)
console.log('DB_USER:', process.env.DB_USER);    // Shows database username

bootstrap();
