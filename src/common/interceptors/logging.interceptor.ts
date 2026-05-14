import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    console.log(`➡️ ${method} ${url} request received`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        console.log(`✅ ${method} ${url} completed in ${Date.now() - now}ms`),
      ),
    );
  }
}
