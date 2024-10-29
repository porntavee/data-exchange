import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ProvisioningHistoryTable } from "@app/pages/provisioning-history/provisioning-history.component";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ProvisioningHistoryService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) {}

  getRunningConfig(suggested_ip) {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.apiUrl}/device/running-config?ip=${suggested_ip}`
    );
  }
  valueSource(item) {
    this.messageSource.next(item);
  }
  getPing(suggested_ip, uplink_ip) {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.apiUrl}/device/ping?destination=${suggested_ip}&source=${uplink_ip}`
    );
  }

  getProvisioningHistory() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/provisioning/history", {
      headers: headers
    });
  }
  getconfigFile(res_id) {
    return this.http.get<any>(`${environment.apiUrl}/device/config/${res_id}`);
  }
  SetsnmpLocation(management_ip, latitude, longitude, provisioning_id) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      latitude: latitude,
      longitude: longitude,
      provisioning_id: provisioning_id
    });
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/set-snmp-location?ip=${management_ip}`,
      body,
      { headers: headers }
    );
  }
  getHistoryForExport(start_date, end_date) {
    return this.http.get<any>(
      `${environment.apiUrl}/provisioning/history?start_date=${start_date}&end_date=${end_date}`
    );
  }
  getSearchDevice(input) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/search_device?searchInput=${input}`
    );
  }
  getUplinkDevice() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/device/uplink", {
      headers: headers
    });
  }
  getgenerate_config(parent_id, model, parent_ip, excluded_ips) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    if (parent_id && parent_id != "") {
      params = params.append("parent_id", parent_id);
    }
    if (model && model != "") {
      params = params.append("model", model);
    }
    if (parent_ip && parent_ip != "") {
      params = params.append("parent_ip", parent_ip);
    }
    if (excluded_ips && excluded_ips != "") {
      params = params.append("excluded_ips", excluded_ips);
    }

    return this.http.get<any>(
      environment.apiUrl + "/provisioning/generate-config",
      {
        headers: headers,
        params: params
      }
    );
    // return this.http.get<any>(
    //   `${environment.apiUrl}/provisioning/generate-config?parent_id=${parent_id}&model=${model}&parent_ip=${parent_ip}&excluded_ips=${excluded_ips}`
    // );
  }
  getSysInterface(ip_addr) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr
    });
    return this.http.post<any>(
      `${environment.serviceURL}/getNodeInterface`,
      body,
      { headers: headers }
    );
  }
  getVlantable(res_id) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/${res_id}/interfaces`
    );
  }
  getview(ip, filename) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/config?ip_address=${ip}&filename=${filename}`
    );
  }
  verifyPassword(password) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      password: password
    });
    return this.http.post<any>(
      environment.apiUrl + "/user/password_verify",
      body,
      { headers: headers }
    );
  }
  rebootpPush(username, password, ip, reboot, filename) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      username: username,
      password: password,
      IPADDRESS: ip,
      reboot: reboot,
      filename: filename
    });
    return this.http.post<any>(
      environment.apiUrl + "/script/push_config",
      body,
      { headers: headers }
    );
  }
  AddSchedule(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.apiUrl}/provisioning/`, body, {
      headers: headers
    });
  }

  AddZTPSchedule(uplink_ip, start_at, selectedEdgeModels) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      start_at: start_at,
      selected_edge_model: selectedEdgeModels
    });
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/enable-ztp`,
      body,
      { headers: headers }
    );
  }

  AddZTPImmediately(uplink_ip, selectedEdgeModels) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      selected_edge_model: selectedEdgeModels
    });
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/enable-ztp`,
      body,
      { headers: headers }
    );
  }
}
