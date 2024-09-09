import { Component, Inject, OnInit } from '@angular/core';
import { TodoGateway, TodoGatewayToken } from 'src/app/gateways/TodoGateway';

export type TodoType = {
  id: string;
  description: string;
  done: boolean;
}

@Component({
  selector: 'TodoListView',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss']
})
export class TodoListViewComponent implements OnInit {
  baseUrl = 'http://localhost:3000';
  todos!: Array<TodoType>;
  description = '';
  completed = 0;

  constructor(
    @Inject(TodoGatewayToken) private todoGateway: TodoGateway,
  ) { }

  ngOnInit(): void {
    this.todoGateway.getTodos().subscribe({
      next: (response) => {
        console.log(response);
        this.todos = response as Array<TodoType>;
        this.updateCompleted();
      },
      error: (error) => { console.log(error) }
    })
  }

  addItem() {
    if (!this.description) {
      alert('Digite uma tarefa, antes de adicionar');
      return;
    }

    if (this.todos.some(todo => todo.description === this.description)) {
      alert('Essa tarefa ja existe!');
      return;
    }

    if (this.todos.filter(todo => !todo.done).length > 4) {
      alert('Conclua ou remova as tarefas anteriores antes de inserir novas!');
      return;
    }

    const item: TodoType = {
      id: crypto.randomUUID(),
      description: this.description,
      done: false,
    };

    if (!this.todos) this.todos = [];

    this.todos.push(item);
    this.description = '';

    this.todoGateway.addItem(item).subscribe({
      next: () => { this.updateCompleted() },
      error: (error) => { console.log(error) }
    });
  }

  toggleDone(item: TodoType) {
    item.done = !item.done;

    this.todoGateway.updateItem(item).subscribe({
      next: () => { this.updateCompleted() },
      error: (error) => { console.log(error) }
    });
  }

  updateCompleted() {
    const total = this.todos.length;
    const done = this.todos.filter(todo => todo.done).length;

    this.completed = Number((done / total).toFixed(2)) * 100;
  }

  remove(item: TodoType) {
    this.todos.splice(this.todos.indexOf(item), 1);

    this.todoGateway.removeItem(item.id).subscribe({
      next: () => { this.updateCompleted() },
      error: (error) => { console.log(error) }
    });
  }
}
