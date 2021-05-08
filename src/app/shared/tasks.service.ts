import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Observable } from "rxjs";
import * as moment from "moment";

export interface Tasks{
    title: string
    id?: string
    date: string
}

interface CreateResponse{
    name: string
}
@Injectable({providedIn: 'root'})
export class TaskService{
    static url = 'https://angular-date-project-default-rtdb.firebaseio.com/tasks'
    constructor(public http: HttpClient){
    }

    load(date: moment.Moment): Observable<Tasks[]>{
        return this.http.get<Tasks[]>(`${TaskService.url}/${date.format('DD-MM-YYYY')}.json`)
        .pipe(map( tasks =>{
            if(!tasks){
                return []
            }
            return Object.keys(tasks).map(key=>({...tasks[key], id: key}))
        }))
    }
    create(task: Tasks): Observable<Tasks>{
        return this.http.post<CreateResponse>(`${TaskService.url}/${task.date}.json`, task)
        .pipe(map( res=> {
            return {...task, id: res.name};
        }))
    }
    remove(task: Tasks):Observable<void>{
        return this.http.delete<void>(`${TaskService.url}/${task.date}/${task.id}.json`)
    }
}
