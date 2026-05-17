import { ValidationPipe } from '@nestjs/common'; // ✅ Import ValidationPipe para automatic DTO validation
import { NestFactory } from '@nestjs/core';      // ✅ Import NestFactory para maka-create ug NestJS app instance
import { AppModule } from './app.module';        // ✅ Import root AppModule (entry point sa imong app)

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // ✅ Create NestJS application gamit ang AppModule

  app.useGlobalPipes(
    new ValidationPipe({                          // ✅ Apply global validation pipe
      whitelist: true                             // whitelist: true → automatic remove ang extra fields nga wala sa DTO
    })        
    
  );

  await app.listen(parseInt(process.env.PORT ?? '3000', 10));   // ✅ Start server sa port gikan sa .env (PORT) or default 3000 kung wala gi-set
  
}
bootstrap(); // ✅ Run bootstrap function aron mo-launch ang application
