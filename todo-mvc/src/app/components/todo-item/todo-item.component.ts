import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/todo.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

const fadeStrikeThroughAnimation = trigger('fadeStrikeThrough',[
  state(
    'active',
    style({
      fontSize : '18px',
      color : 'black'
    }),
  ),
    state(
      'completed',
      style({
        fontSize:'17px',
        color :'lightgrey',
        textDecoration:'line-through',
      }),
    ),
    transition('active <=> completed',[animate(250)]),
]);


@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [fadeStrikeThroughAnimation],
})
export class TodoItemComponent implements OnInit {

  @Input() todo :Todo;
  @Output() changeStatus : EventEmitter<Todo> =  new EventEmitter<Todo>();
  @Output() changeContent :EventEmitter<Todo> =  new EventEmitter<Todo>();
  @Output() removeTodo :EventEmitter<Todo> =  new EventEmitter<Todo>();
  isHovered = false;
  isEditing = false;

  constructor() { }

  ngOnInit() {

  }
  changeIsComplete(){
    this.changeStatus.emit({...this.todo , isCompleted : !this.todo.isCompleted});
  }
  changeContentSubmit(event :KeyboardEvent){
    const {keyCode} = event;
    event.preventDefault();
    if(keyCode == 13){
      this.changeContent.emit(this.todo);
      this.isEditing = false;
    }
  }
  deleteTodo(){
    this.removeTodo.emit(this.todo);
  }

}
