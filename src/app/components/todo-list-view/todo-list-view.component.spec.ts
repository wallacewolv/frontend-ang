import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TodoListViewComponent } from './todo-list-view.component';
import { By } from '@angular/platform-browser';

describe('TodoListViewComponent', () => {
  let component: TodoListViewComponent;
  let fixture: ComponentFixture<TodoListViewComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoListViewComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListViewComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  // Testando a lógica do componente  (TS)
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todos on init', () => {
    const mockTodos = [
      { id: '1', description: 'Task 1', done: false },
      { id: '2', description: 'Task 2', done: true }
    ];

    // Mock da requisição HTTP GET
    const req = httpMock.expectOne(`${component.baseUrl}/todos`);
    req.flush(mockTodos);

    // Verificar se os todos foram carregados corretamente
    expect(component.todos.length).toBe(2);
    expect(component.todos[0].description).toBe('Task 1');
  });

  it('should add a new item', () => {
    component.description = 'New Task';

    // Espera pela requisição GET que ocorre no ngOnInit
    const getReq = httpMock.expectOne(`${component.baseUrl}/todos`);
    expect(getReq.request.method).toBe('GET');

    // Simula a resposta para o GET, retornando uma lista vazia de todos
    getReq.flush([]);

    // Acionando o método addItem para adicionar uma nova tarefa
    component.addItem();

    // Verifica se o novo item foi adicionado à lista local de `todos`
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].description).toBe('New Task');

    // Espera pela requisição POST que adiciona a nova tarefa
    const postReq = httpMock.expectOne(`${component.baseUrl}/todos`);
    expect(postReq.request.method).toBe('POST');

    // Simula uma resposta bem-sucedida do POST
    postReq.flush({});

    // Verifica se mais nenhuma requisição pendente foi feita
    httpMock.verify();
  });

  it('should toggle done status', () => {
    const todo = { id: '1', description: 'Task 1', done: false };
    component.todos = [todo];

    component.toggleDone(todo);

    expect(todo.done).toBe(true); // O estado `done` deve ser alterado para `true`

    // Mock da requisição HTTP PUT
    const req = httpMock.expectOne(`${component.baseUrl}/todos/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({}); // Simula uma resposta bem-sucedida
  });

  it('should remove a todo item', () => {
    const todo = { id: '1', description: 'Task 1', done: false };
    component.todos = [todo];

    component.remove(todo);

    expect(component.todos.length).toBe(0); // Verifica se o todo foi removido

    // Mock da requisição HTTP DELETE
    const req = httpMock.expectOne(`${component.baseUrl}/todos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simula uma resposta bem-sucedida
  });

  // Testando a interface gráfica (HTML)
  it('should display "Adicione tarefas" when there are no todos', () => {
    component.todos = [];
    fixture.detectChanges(); // Atualiza o template

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.todos-container')?.textContent).toContain(' Tarefas completas:');
  });

  it('should strike-through text when todo is done', () => {
    component.todos = [{ id: '1', description: 'Task 1', done: true }];
    fixture.detectChanges(); // Atualiza o template

    const compiled = fixture.nativeElement as HTMLElement;
    const todoText = compiled.querySelector('span') as HTMLElement;

    // Verifica se o `text-decoration` foi aplicado corretamente
    expect(todoText.style.textDecoration).toBe('line-through');
  });

  it('should call toggleDone when the done button is clicked', () => {
    spyOn(component, 'toggleDone');

    component.todos = [{ id: '1', description: 'Task 1', done: false }];
    fixture.detectChanges();

    const doneButton = fixture.nativeElement.querySelector('.todo-done a');
    doneButton.click(); // Simula o clique no botão "✅"

    expect(component.toggleDone).toHaveBeenCalledWith(component.todos[0]);
  });

  it('should bind input value to description and call addItem() on enter key', () => {
    const inputElement = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;

    // Simula a entrada de texto no input
    inputElement.value = 'New Task';
    inputElement.dispatchEvent(new Event('input')); // Dispara o evento de input

    // Verifica se o valor foi atualizado no componente
    expect(component.description).toBe('New Task');

    // Spy no método addItem para verificar se foi chamado
    spyOn(component, 'addItem');

    // Simula o pressionamento da tecla Enter
    const keyboardEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    inputElement.dispatchEvent(keyboardEvent);

    // Verifica se o método addItem foi chamado
    expect(component.addItem).toHaveBeenCalled();
  });
});
