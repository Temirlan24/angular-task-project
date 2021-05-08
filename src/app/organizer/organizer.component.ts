import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { Tasks, TaskService } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup
  tasks: Tasks[] = []
  constructor(public dateService: DateService,
              public tasksService: TaskService) { }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value=>this.tasksService.load(value))
    ).subscribe(tasks =>{
      this.tasks = tasks
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit(){
    const {title} = this.form.value;
    const task: Tasks = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.tasksService.create(task).subscribe(task =>{
      this.tasks.push(task)
      this.form.reset()
    }, err => console.error(err));
  }
  remove(task:Tasks){
    this.tasksService.remove(task).subscribe(()=>{
      this.tasks = this.tasks.filter(t=>t.id!==task.id)
    }, err => console.error(err));
  }
}
