import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger('LOG');
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const body = this.sanitizeObject(request.body);
    const params = request.params;

    return next.handle().pipe(
      tap(() => {
        if (body && 'password' in body) body.password = '***';
        const duration = Date.now() - start;

        logger.verbose(`${method};${url};${duration}ms;${this.str(body)};${this.str(params)}`);
      }),
    );
  }

  private sanitizeObject(data: unknown): Record<string, unknown> | null {
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : null;
  }

  private str(data: any): string {
    if (data === null || data === undefined) return '';
    return JSON.stringify(data);
  }
}
