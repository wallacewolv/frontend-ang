import { Component, Inject, OnInit } from '@angular/core';
import { TodoList } from 'src/app/entities/TodoList';
import { TodoGatewayToken, TodoGateway } from 'src/app/gateways/TodoGateway';

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
export class TodoListViewComponent  {
  description = '';

  constructor(
    @Inject(TodoGatewayToken) private todoGateway: TodoGateway,
    public todoList: TodoList,
  ) { }

  addItem() {
    this.todoList.addItem(this.description);
    this.description = '';
  }
}
