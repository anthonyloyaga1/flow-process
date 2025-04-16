import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveNullsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        try {
          return this.removeNullsFromObject(data);
        } catch {
          return data;
        }
      }),
    );
  }

  private removeNullsFromObject(data) {
    return JSON.parse(
      JSON.stringify(data, (_key, value) => {
        if (value === null || value === undefined) {
          return undefined;
        }
        return value;
      }),
    );
  }
}
