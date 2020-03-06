import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todos';
  private todos : Todo[];
  private fillerdTodos : Todo[];

  private lenghtSubject :BehaviorSubject<number> =  new BehaviorSubject<number>(0);
  private displayTodoSubject :BehaviorSubject<Todo[]> =  new BehaviorSubject<Todo[]>([]);
  private currentFiller : Filter =Filter.All;

  todo$ : Observable<Todo[]> = this.displayTodoSubject.asObservable();
  lenght$ : Observable<number> = this.lenghtSubject.asObservable();
  constructor(private storageService :LocalStorageService) {

   }
   fetchFromLocalStorage(){
     this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    //  this.fillerdTodos = [...this.todos.map(todo => ({...todo}))];
     this.fillerdTodos = [...this.todos];
     this.updateData();
   }
   filterTodos(filter: Filter,isFiltering :boolean = true){
      this.currentFiller = filter;

      switch(filter){
        case Filter.Active:
          this.fillerdTodos  = this.todos.filter(t => !t.isCompleted);
          break;
        case Filter.Completed:
          this.fillerdTodos = this.todos.filter(t => t.isCompleted);
          break;
        case Filter.All:
          // this.fillerdTodos = [...this.todos.map(todo => ({...todo}))];
          this.fillerdTodos = [...this.todos];
          break;
      }
      if(isFiltering){
        this.updateData();
      }
   }


   updateTodoLocalStorage(){
     this.storageService.setObject(TodoService.TodoStorageKey,this.todos)
     this.filterTodos(this.currentFiller,false);
     this.updateData();

   }

   private updateData() {
    this.displayTodoSubject.next(this.fillerdTodos);
    this.lenghtSubject.next(this.todos.length);
  }

  addTodo(content :string){
    const date = new Date(Date.now()).getTime();
    const newtodo = new Todo(date,content);
    this.todos.unshift(newtodo);
    this.updateTodoLocalStorage();
  }
  changeStatus(id : number ,isCompleted : boolean){
    // const index = this.todos.findIndex(t => t.id === id);
    // const tod = this.todos[index];
    // tod.isCompleted = isCompleted;
    // this.todos.splice(index,1,tod);
    const tod = this.todos.find(t => t.id ===id);
    tod.isCompleted = !tod.isCompleted;
    this.updateTodoLocalStorage();
  }
  onChangeContentEdit(id :number , content :string){
    const tod = this.todos.find(t => t.id ===id);
    tod.content = content;
    this.updateTodoLocalStorage();
  }

  onDeleteTodoServe(id:number){
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index,1);
    this.updateTodoLocalStorage();
  }
  clearTodoCompleted(){
    this.todos = this.todos.filter(t => !t.isCompleted);
    this.updateTodoLocalStorage();
  }
  toggleAll(){
    this.todos = this.todos.map(t => {
      return{
        ...t,
        isCompleted :!this.todos.every(td =>td.isCompleted)
      };
    })
    this.updateTodoLocalStorage();
  }

}
