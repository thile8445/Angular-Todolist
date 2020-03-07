import { Component, OnInit } from '@angular/core';
import { FilterButton, Filter } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';
import { Observable, observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ];

  length = 0;
  hasComplete$ :Observable<boolean> =  new Observable<boolean>();
  destroy$ : Subject<null> =  new Subject<null>();
  constructor(private todoService :TodoService) {}

  ngOnInit() {
    this.hasComplete$ = this.todoService.todo$.pipe(
      map(
        t => t.some(td => td.isCompleted)),
        takeUntil(this.destroy$)
      );

      this.todoService.lenght$.pipe(takeUntil(this.destroy$)).subscribe(t => this.length = t);
  }
  filterB(type :Filter){
    this.todoService.filterTodos(type);
      this.setActiceBtn(type);

  }
  setActiceBtn(type :Filter){
    this.filterButtons.forEach(t =>{
      t.isActive = t.type === type;
    })
  }
  clearCompleted(){
    this.todoService.clearTodoCompleted();
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();

  }
}
