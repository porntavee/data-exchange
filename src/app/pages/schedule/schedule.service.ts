import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  ScheduleTask,
  ScheduleTaskTable
} from "@app/pages/schedule/schedule.component";
import { environment } from "environments/environment";

@Injectable()
export class ScheduleTaskService {
  constructor(private http: HttpClient) {}
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  getScheduleTask() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/task/schedule", {
      headers: headers
    });
  }
  valueSource(item){
    this.messageSource.next(item)
  }
  editScheduleTask(data) {
    const headers = { "content-type": "application/json" };
    data.mode = data.schedule_type;
    delete data.schedule_type;
    data.name = data.schedule_name;
    delete data.schedule_name;
    data.startDate = data.start_date;
    delete data.start_date;
    data.startTime = data.start_time;
    delete data.start_time;
    const body = JSON.stringify(data);
    return this.http.put<ScheduleTaskTable>(
      environment.apiUrl + "/task/schedule",
      body,
      { headers: headers }
    );
    // .subscribe({
    //     next: data => {

    //     },
    //     error: error => {
    //         console.error('There was an error!', error);
    //     }
    // });
  }
  deleteScheduleTask(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<ScheduleTaskTable>(
        environment.apiUrl + "/task/schedule/delete",
        body,
        { headers: headers }
      )
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
