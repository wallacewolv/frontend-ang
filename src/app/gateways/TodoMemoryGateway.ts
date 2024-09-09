import { Observable, of } from 'rxjs';

import { TodoGateway } from './TodoGateway';

export class TodoMemoryGateway implements TodoGateway {
  todos: any;

  constructor() {
    this.todos = [
      { id: crypto.randomUUID(), description: "Estudar TypeScript", done: true },
      { id: crypto.randomUUID(), description: "Fazer a prova online", done: false },
      { id: crypto.randomUUID(), description: "Cortar a grama", done: false }
    ];
  }

  getTodos(): Observable<any> {
    return of(this.todos);
  }

  addItem(item: any): Observable<any> {
    this.todos.push(item);
    return of();
  }

  updateItem(item: any): Observable<any> {
    const todo = this.todos.find((todo: any) => todo.id === item.id);

    if (todo) {
      todo.done = item.done;
    }

    return of();
  }

  removeItem(id: string): Observable<any> {
    const todo = this.todos.find((todo: any) => todo.id === id);

    if (todo) {
      return this.todos.splice(this.todos.indexOf(todo), 1);
    }

    return of();
  }
}
