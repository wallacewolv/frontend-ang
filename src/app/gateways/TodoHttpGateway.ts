import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import HttpClientAbstract, { HttpClientToken } from '../infra/HttpClient';
import { TodoGateway } from './TodoGateway';

@Injectable({
  providedIn: 'root'
})
export class TodoHttpGateway implements TodoGateway {
  baseUrl = 'http://localhost:3000';

  constructor(
    @Inject(HttpClientToken) private httpClient: HttpClientAbstract,
  ) { }

  getTodos(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/todos`);
  }

  addItem(item: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/todos`, item);
  }

  updateItem(item: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/todos/${item.id}`, item);
  }

  removeItem(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/todos/${id}`);
  }
}
