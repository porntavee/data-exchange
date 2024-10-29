import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Device } from "app/pages/device-search/device-search.component";
import {
  Alarmstatistices,
  Alarmlist,
  Alarmcount,
  AlarmMarker,
  portlink,
  portlink24
} from "./alarmlog";
import { BehaviorSubject } from "rxjs";
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
@Injectable({
  providedIn: "root"
})
export class DeviceService {
  loadalram_interval: any;
  uplink_ip: any;
  mac: any;
  port_lable: string = "";
  imagelist: any[];
  imagelist2: any[];
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  private messageSourceMenu = new BehaviorSubject(undefined);
  currentMessageMenu = this.messageSourceMenu.asObservable();
  private messageSourceMenutable = new BehaviorSubject(undefined);
  currentMessageMenutable = this.messageSourceMenutable.asObservable();
  constructor(private http: HttpClient) {
    this.imagelist = [
      {
        previewImageSrc: "assets/img/information/P1.png",
        thumbnailImageSrc: "assets/img/information/P1.png"
      },
      {
        previewImageSrc: "assets/img/information/P2.png",
        thumbnailImageSrc: "assets/img/information/P2.png"
      },
      {
        previewImageSrc: "assets/img/information/P3.png",
        thumbnailImageSrc: "assets/img/information/P3.png"
      },
      {
        previewImageSrc: "assets/img/information/P4.png",
        thumbnailImageSrc: "assets/img/information/P4.png"
      }
    ];
    this.imagelist2 = [
      {
        previewImageSrc: "assets/img/information/T.png",
        thumbnailImageSrc: "assets/img/information/T.png"
      },
      {
        previewImageSrc: "assets/img/information/T1.png",
        thumbnailImageSrc: "assets/img/information/T1.png"
      },
      {
        previewImageSrc: "assets/img/information/T2.png",
        thumbnailImageSrc: "assets/img/information/T2.png"
      }
    ];
  }
  valueSource(item) {
    this.messageSource.next(item);
  }
  valueSourceMenu(item) {
    this.messageSourceMenu.next(item);
  }
  valueSourceMenutable(item) {
    this.messageSourceMenutable.next(item);
  }
  getimage() {
    return of(this.imagelist);
  }
  getimage2() {
    return of(this.imagelist2);
  }
  getdeviceInformation(res_id) {
    return this.http.get<any>(`${environment.serviceURL}/switch/${res_id}`);
  }
  getgenerate_config(parent_id, model, parent_ip, excluded_ips?) {
    if (excluded_ips != undefined) {
      return this.http.get<any>(
        `${environment.apiUrl}/provisioning/generate-config?parent_id=${parent_id}&model=${model}&parent_ip=${parent_ip}&excluded_ips=${excluded_ips}`
      );
    } else {
      return this.http.get<any>(
        `${environment.apiUrl}/provisioning/generate-config?parent_id=${parent_id}&model=${model}&parent_ip=${parent_ip}`
      );
    }
  }
  getPings(destination) {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      `${environment.apiUrl}/device/server-ping?destination=${destination}`
    );
  }
  getconfigFile(res_id) {
    return this.http.get<any>(`${environment.apiUrl}/device/config/${res_id}`);
  }
  getPing(source, destination) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/ping?source=${source}&destination=${destination}`
    );
  }
  getview(ip, filename) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/config?ip_address=${ip}&filename=${filename}`
    );
  }
  getremote_provisioning(provisioning_id) {
    return this.http.get<any>(
      `${environment.apiUrl}/provisioning/remote-provisioning?provisioning_id=${provisioning_id}`
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
  SetsnmpLocation(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/now`,
      body,
      { headers: headers }
    );
  }
  remote_provisioning(
    uplink_ip,
    port_uplink,
    remote_mac,
    script,
    model,
    suggested_ip
  ) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      uplink_port: port_uplink,
      remote_mac: remote_mac,
      script: script,
      model: model,
      suggested_ip: suggested_ip
    });
    return this.http.post<any>(
      environment.apiUrl + "/provisioning/pre-provisioning",
      body,
      { headers: headers }
    );
  }
  getShowrunningConfig(suggested_ip) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/running-config?ip=${suggested_ip}`
    );
  }
  getRemote_device(uplink_ip, mac) {
    return this.http.get<any>(
      `${environment.apiUrl}/provisioning/remote-device-ip?uplink_ip=${uplink_ip}&mac=${mac}`
    );
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      if (error.status == 404) {
        console.error("An error occurred:", error.error.message);
      }
    }

    return throwError({ error });
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
  editconfigFile(ip, filename, content) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      filename: filename,
      content: content
    });
    return this.http.post<any>(
      `${environment.apiUrl}/device/config?ip=${ip}`,
      body,
      { headers: headers }
    );
  }
  deletedata(ip, filename) {
    return this.http.delete<any>(
      `${environment.apiUrl}/device/config?ip_address=${ip}&filename=${filename}`
    );
  }
  uploaddata(ip, file): Observable<any> {
    const formData = new FormData();
    formData.append("ip_address", ip);
    formData.append("file", file, file.name);
    return this.http.post<any>(
      environment.apiUrl + "/device/upload_config",
      formData
    );
  }

  getBandwidthData(res_id) {
    return this.http.get<any>(`${environment.apiUrl}/graph/${res_id}`);
  }

  getCerrentBandwidthCharts(res_id) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/bandwidth_stat?res_id=${res_id}`
    );
  }

  getBandwidthChartsByDate(res_id, date_from, date_to, intervaltime) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/${res_id}/bandwidth_resample?from_date=${date_from}&to_date=${date_to}&periods=${intervaltime}`
    );
  }

  getVlantable(res_id) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/${res_id}/interfaces`
    );
  }
  get_sys_info(ip_address) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_address: ip_address
    });
    return this.http.post<any>(
      `${environment.serviceURL}/bg/get_sys_info`,
      body,
      {
        headers: headers
      }
    );
  }
  edit_conf(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_address: data.ip_address,
      configdata: data.configdata
    });
    return this.http.post<any>(`${environment.serviceURL}/bg/edit_conf`, body, {
      headers: headers
    });
  }
  loadStattisticAlarm(ipAddress) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_address: ipAddress
    });
    return this.http.post<any>(
      `${environment.apiUrl}/alarm/alarm_by_ip`,
      body,
      {
        headers: headers
      }
    );
  }
  getSearchDevice(input) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/search_device?searchInput=${input}`
    );
  }
  getSearchbackupDevice(inputs) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/?is_completed_setup=${inputs}`
    );
  }
  getSearchbackupsDevice(inputs) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/?is_backed_up=${inputs}`
    );
  }
  getCongigbackup(ip: string) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_address: ip
    });
    return this.http.post<any>(
      `${environment.serviceURL}/backup_config_by_ip`,
      body,
      {
        headers: headers
      }
    );
  }
  getconfigDevice(Username: string, password: string, ip: string) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    if (Username && Username != "") {
      params = params.append("username", Username);
    }
    if (password && password != "") {
      params = params.append("password", password);
    }
    if (ip && ip != "") {
      params = params.append("ip", ip);
    }
    return this.http.get<any>(environment.apiUrl + "/device/load_config", {
      headers: headers,
      params: params
    });
  }
  request(res) {
    let params = new HttpParams().set("username", res);
    return this.http.get(`${environment.apiUrl}/device/load_config`, {
      params
    });
  }
  downloadReport(ip, filename) {
    return this.http.get(
      `${environment.apiUrl}/device/config?ip_address=${ip}&filename=${filename}`,
      { responseType: "blob" }
    );
  }

  AddSchedule(
    uplink_ip,
    uplink_port,
    mac,
    script,
    model,
    suggested_ip,
    latitude,
    longitude,
    start_at
  ) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      uplink_port: uplink_port,
      mac: mac,
      script: script,
      model: model,
      suggested_ip: suggested_ip,
      latitude: latitude,
      longitude: longitude,
      start_at: start_at
    });
    return this.http.post<any>(`${environment.apiUrl}/provisioning/`, body, {
      headers: headers
    });
  }

  AddZTPSchedule(uplink_ip, start_at) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      start_at: start_at
    });
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/enable-ztp`,
      body,
      { headers: headers }
    );
  }
  AddZTPImmediately(uplink_ip, dformat) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      uplink_ip: uplink_ip,
      start_at: dformat
    });
    return this.http.post<any>(
      `${environment.apiUrl}/provisioning/enable-ztp`,
      body,
      { headers: headers }
    );
  }

  getUplinkDevice() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/device/uplink", {
      headers: headers
    });
  }

  getProvisioningHistory() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/provisioning/history", {
      headers: headers
    });
  }

  disableZTP(ip) {
    return this.http.put<any>(
      `${environment.apiUrl}/device/disable_snmp_host?ip=${ip}`,
      {}
    );
  }

  checkZTPstatus(ip) {
    return this.http.get<boolean>(
      `${environment.apiUrl}/device/check_snmp_host?ip=${ip}`
    );
  }

  exportMonthlyPDF(res_id, port_number, datePicker) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      resID: res_id,
      portID: port_number,
      date: datePicker
    });
    return this.http.post<any>(
      `${environment.apiUrl}/report/monthly_report`,
      body,
      { headers: headers }
    );
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
  getRangeBandwidth(ip_addr, start, end, if_index) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      start: start,
      end: end,
      if_index: if_index
    });
    return this.http.post<any>(
      `${environment.serviceURL}/getRangeBandwidth`,
      body,
      { headers: headers }
    );
  }
  getRangeMemory(ip_addr, start, end) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      start: start,
      end: end
    });
    return this.http.post<any>(
      `${environment.serviceURL}/getRangeMemory`,
      body,
      { headers: headers }
    );
  }
  getRangeCPU(ip_addr, start, end) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      start: start,
      end: end,
      load_x_min: 2
    });
    return this.http.post<any>(`${environment.serviceURL}/getRangeCPU`, body, {
      headers: headers
    });
  }
  getRangeTemp(ip_addr, start, end) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      start: start,
      end: end
    });
    return this.http.post<any>(`${environment.serviceURL}/getRangeTemp`, body, {
      headers: headers
    });
  }
  getRangeVolt(ip_addr, start, end) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      start: start,
      end: end
    });
    return this.http.post<any>(
      `${environment.serviceURL}/getRangeVoltAll`,
      body,
      { headers: headers }
    );
  }
  getCPU(ip_addr, load_x_min) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      load_x_min: load_x_min
    });
    return this.http.post<any>(`${environment.serviceURL}/getCPU`, body, {
      headers: headers
    });
  }
  getMemory(ip_addr) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr
    });
    return this.http.post<any>(`${environment.serviceURL}/getMemory`, body, {
      headers: headers
    });
  }
  getVolt(ip_addr, volt_index) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr,
      volt_index: volt_index
    });
    return this.http.post<any>(`${environment.serviceURL}/getVolt`, body, {
      headers: headers
    });
  }
  getTemp(ip_addr) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      ip_addr: ip_addr
    });
    return this.http.post<any>(`${environment.serviceURL}/getTemp`, body, {
      headers: headers
    });
  }
  getDashboard() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(environment.apiUrl + "/dashboard/device_info", {
      headers: headers
    });
  }
  saveDashboard(mockDashboard) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      widget_list: mockDashboard
    });
    return this.http.post<any>(
      environment.apiUrl + "/dashboard/device_info",
      body,
      { headers: headers }
    );
  }
}
