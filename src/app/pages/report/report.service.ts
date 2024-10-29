import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ReportComponent,
  TaskResult
} from "@app/pages/report/report.component";
import { environment } from "environments/environment";
import { param } from "jquery";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class TaskReportService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) {}
  valueSource(item){
    this.messageSource.next(item)
  }
  getReport() {
    const headers = { accept: "application/json" };
    return this.http.get<any>(environment.apiUrl + "/task/report", {
      headers: headers
    });
  }
  deletetaskResult(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<TaskResult>(environment.apiUrl + "/task/report/delete", body, {
        headers: headers
      })
      .subscribe({
        next: data => {},
        error: error => {
          console.error("There was an error!", error);
        }
      });
  }
  downloadReport(session_id, schedule_name) {
    return this.http.get(
      environment.apiUrl + "/task/" + session_id + "/schedule_report_file",
      { responseType: "blob" }
    );
  }

  getPreviewResult(session_id) {
    return this.http.get<any>(
      environment.apiUrl + "/task/" + session_id + "/schedule_report_content"
    );
  }
}
