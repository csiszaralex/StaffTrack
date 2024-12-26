import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger('LOG');
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const body = request.body;
    const params = request.params;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        logger.verbose(
          `${method};${url};${duration}ms;${JSON.stringify(body)};${JSON.stringify(params)}`,
        );
      }),
    );
  }
}
