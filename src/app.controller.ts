import { Controller, Get } from '@nestjs/common';
// Import sa NestJS decorators: Controller (para sa route handler) ug Get (para sa GET request).

import { AppService } from './app.service';
// Import sa AppService para magamit ang iyang logic.

@Controller()
// Gi‑mark ang class nga AppController as a controller → mo‑handle sa HTTP requests.

export class AppController {
  // Gi‑declare ang AppController class.

  constructor(private readonly appService: AppService) {}
  // Gi‑inject ang AppService sa controller gamit ang constructor dependency injection.

  @Get()
  // Gi‑define nga ang method below mo‑handle sa GET request sa root path "/".

  getHello(): string {
    // Method nga mo‑return ug string.
    return this.appService.getHello();
    // Gi‑call ang service method getHello() → mao ang "Hello World!" nga response.
  }
}
