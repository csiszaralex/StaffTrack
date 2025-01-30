import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) return data.map(item => this.excludeFields(item));
        return this.excludeFields(data);
      }),
    );
  }

  private excludeFields<T extends Record<string, any>>(data: T): Partial<T> {
    if (!data || typeof data !== 'object') return data;
    const result = { ...data };
    for (const field of this.fields as (keyof T)[]) {
      delete result[field];
    }
    return result;
  }
}

export function ExcludeFields(fields: string[]) {
  return applyDecorators(UseInterceptors(new ExcludeFieldsInterceptor(fields)));
}
