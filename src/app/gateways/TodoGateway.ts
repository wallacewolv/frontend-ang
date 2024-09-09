import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const TodoGatewayToken = new InjectionToken<TodoGateway>('TodoGateway');

export interface TodoGateway {
  getTodos(): Observable<any>;
  addItem(item: any): Observable<any>;
  updateItem(item: any): Observable<any>;
  removeItem(id: string): Observable<any>;
}
