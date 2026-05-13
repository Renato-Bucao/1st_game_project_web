import { Injectable } from '@nestjs/common'; 
// Import sa NestJS decorator nga "Injectable" → para mahimo siyang service nga pwede i‑inject sa controller.

@Injectable()
// Gi‑mark ang class nga AppService as injectable (pwede gamiton sa lain nga class).

export class AppService {
  // Gi‑declare ang AppService class → mao ni ang logic provider.

  getHello(): string {
    // Method nga mo‑return ug string → gi‑call sa controller.
    return 'Hello World!';
    // Ang actual response nga mo‑gawas kung i‑call ang GET route.
  }
}
