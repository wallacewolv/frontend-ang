import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListViewComponent } from './components/todo-list-view/todo-list-view.component';
import { TodoGatewayToken } from './gateways/TodoGateway';
import TodoHttpGateway from './gateways/TodoHttpGateway';
import { HttpClientAdapter } from './infra/HttpAdapter';
import { HttpClientToken } from './infra/HttpClient';

@NgModule({
  declarations: [
    AppComponent,
    TodoListViewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HttpClientToken, useClass: HttpClientAdapter },
    { provide: TodoGatewayToken, useClass: TodoHttpGateway }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
