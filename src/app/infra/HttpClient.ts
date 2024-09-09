import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const HttpClientToken = new InjectionToken<HttpClientAbstract>('HttpClientAbstract');

export default interface HttpClientAbstract {
  get(url: string): Observable<any>;
  post(url: string, body: any): Observable<any>;
  put(url: string, body: any): Observable<any>;
  delete(url: string): Observable<any>;
}
