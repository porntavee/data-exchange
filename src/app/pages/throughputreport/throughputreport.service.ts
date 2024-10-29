import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throughputreport } from "@app/pages/throughputreport/throughputreport.component";
import { of } from "rxjs";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ThroughputreportService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  throughputreport: throughputreport[];
  constructor(private http: HttpClient) {
    this.throughputreport = [
      {
        ipaddress: "10.208.59.45",
        remote_ipaddress: "10.208.59.46",
        service_name: "circuit-1",
        vlan: 86,
        inserttime: "2022-04-11T15:30:00"
      },
      {
        ipaddress: "10.208.60.45",
        remote_ipaddress: "10.208.60.46",
        service_name: "circuit-1",
        vlan: 87,
        inserttime: "2022-04-11T15:30:00"
      }
    ];
  }
  valueSource(item) {
    this.messageSource.next(item);
  }
  resultthroughput() {
    return of(this.throughputreport);
  }
  throughputResultList(mode: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/script/throughtput_report_list/${mode}`
    );
  }
  throughputResult(mode: string, params: throughputreport) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(params);
    return this.http.post<any>(
      `${environment.apiUrl}/script/throughtput_report/${mode}`,
      body,
      { headers: headers }
    );
  }

  deleteRecord(ref) {
    const headers = { "content-type": "application/json" };
    return this.http.delete<any>(
      `${environment.apiUrl}/script/throughtput_report/${ref}`,
      { headers: headers }
    );
  }
}
