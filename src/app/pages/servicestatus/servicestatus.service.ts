import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { data, map } from "jquery";
import { BehaviorSubject, from, Observable, of } from "rxjs";

import { environment } from "environments/environment";
import { MessageService, ConfirmationService } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class ServicestatusService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getDataLinux() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.dataExchangeURL}/status/instance/linux`,
      {
        headers: headers
      }
    );
  }

  getDataWindow() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.dataExchangeURL}/status/instance/windows`,
      {
        headers: headers
      }
    );
  }

  getDataExchange() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.loginURL}/backup/database/data_exchange`,
      {
        headers: headers
      }
    );
  }

  windows_cpu_time_total(start, end, step) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      start: start,
      end: end,
      step: step
    });
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/windows_cpu_time_total`,
      body,
      { headers: headers }
    );
  }
  cpu_usage() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/cpu_usage`,
      body,
      {
        headers: headers
      }
    );
  }

  disk_usage() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/disk_usage`,
      body,
      {
        headers: headers
      }
    );
  }

  memory_usage() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/memory_usage`,
      body,
      {
        headers: headers
      }
    );
  }
  cpu_usage_netmon() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/cpu_usage_netmon`,
      body,
      {
        headers: headers
      }
    );
  }

  disk_usage_netmon() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/disk_usage_netmon`,
      body,
      {
        headers: headers
      }
    );
  }

  memory_usage_netmon() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/memory_usage_netmon`,
      body,
      {
        headers: headers
      }
    );
  }
  disk_status() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/disk_status`,
      body,
      {
        headers: headers
      }
    );
  }
  disk_status_netmon() {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({});
    return this.http.post<any>(
      `${environment.apiUrl}/monitor_status/disk_status_netmon`,
      body,
      {
        headers: headers
      }
    );
  }
}
