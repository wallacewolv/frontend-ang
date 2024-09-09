import { Inject, Injectable } from '@angular/core';

import { TodoGateway, TodoGatewayToken } from '../gateways/TodoGateway';

@Injectable({
  providedIn: 'root'
})
export class TodoList {
  items: any;

  constructor(
    @Inject(TodoGatewayToken) private todoGateway: TodoGateway,
  ) {
    this.todoGateway.getTodos().subscribe((response) => {
      this.items = response as Array<any>;
    });
  }

  //  this.todoGateway.addItem(item).subscribe({
  //   next: () => { this.updateCompleted() },
  //   error: (error) => { console.log(error) }
  // });
  addItem(description: string) {
    if (!description) {
      alert('Digite uma tarefa, antes de adicionar');
      return;
    }

    if (this.items.some((item: any) => item.description === description)) {
      alert('Essa tarefa ja existe!');
      return;
    }

    if (this.items.filter((item: any) => !item.done).length > 4) {
      alert('Conclua ou remova as tarefas anteriores antes de inserir novas!');
      return;
    }

    const item = {
      id: crypto.randomUUID(),
      description,
      done: false,
    };

    if (!this.items) this.items = [];

    this.items.push(item);
    description = '';
  }

  // this.todoGateway.removeItem(item.id).subscribe({
  //   next: () => { this.updateCompleted() },
  //   error: (error) => { console.log(error) }
  // });
  removeItem(item: any) {
    const newItems = this.items.filter((todo: any) => todo.id !== item.id);
    this.items = newItems;
  }

  // this.todoGateway.updateItem(item).subscribe({
  //   next: () => { this.updateCompleted() },
  //   error: (error) => { console.log(error) }
  // });
  toggleDone(item: any) {
    item.done = !item.done;
  }

  getItem(description: string) {
    return this.items.find((item: any) => item.description === description);
  }

  getCompleted() {
    const total = this.items.length;
    if (total === 0) return 0;

    const done = this.items.filter((item: any) => item.done).length;
    return Number((done / total).toFixed(2)) * 100;
  }
}
