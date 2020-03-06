import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/todo.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todolist :Observable<Todo[]>;
  constructor(private todoService :TodoService) { }

  ngOnInit() {
    this.todolist = this.todoService.todo$;
  }
  onChangeStatus(todo :Todo){
    this.todoService.changeStatus(todo.id,todo.isCompleted);
  }
  onChangeContent(todo :Todo){
    this.todoService.onChangeContentEdit(todo.id,todo.content);
  }
  onDeleteTodo(todo :Todo){
    this.todoService.onDeleteTodoServe(todo.id);
  }

}
