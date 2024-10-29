import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { User } from "@app/user";
import { environment } from "environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboard() {
    const headers = { accept: "application/json" };
    return this.http.get<any>(environment.apiUrl + "/dashboard/get_dashboard", {
      headers: headers
    });
  }
  getdeviceInformation(res_id) {
    return this.http.get<any>(`${environment.serviceURL}/switch/${res_id}`);
  }
  saveDashboard(mockDashboard) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      widget_list: mockDashboard
      // widget_list: [
      //   {
      //     cols: 2,
      //     rows: 2,
      //     y: 0,
      //     x: 0,
      //     widget: {
      //       type: "A",
      //       header: "All devices",
      //       content: {
      //         image: "./assets/img/all_devices.jpg",
      //         data: 3000
      //       },
      //       footer: "something"
      //     }
      // }
      // ]
    });
    return this.http.post<any>(
      environment.apiUrl + "/dashboard/save_dashboard",
      body,
      { headers: headers }
    );
  }
}
