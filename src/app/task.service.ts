import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Task } from "@app/pages/task/task.component";
import { environment } from "environments/environment";
import { HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
@Injectable()
export class TaskService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) {}

  getTask() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/task/", {
      headers: headers
    });
  }
  valueSource(item){
    this.messageSource.next(item)
  }
  createTask(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<Task>(environment.apiUrl + "/task/", body, { headers: headers })
      .subscribe({
        next: data => {},
        error: error => {
          console.error("There was an error!", error);
        }
      });
  }

  deleteTask(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<Task>(environment.apiUrl + "/task/delete", body, {
        headers: headers
      })
      .subscribe({
        next: data => {},
        error: error => {
          console.error("There was an error!", error);
        }
      });
  }
  editTask(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .put<Task>(environment.apiUrl + "/task/" + data.id + "/update", body, {
        headers: headers
      })
      .subscribe({
        next: data => {},
        error: error => {
          console.error("There was an error!", error);
        }
      });
  }

  createScheduleTask(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<any>(environment.apiUrl + "/task/schedule", body, {
        headers: headers
      })
      .subscribe({
        next: data => {},
        error: error => {
          console.error("There was an error!", error);
        }
      });
  }
}
