import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { portlink } from "@app/pages/throughput/throughput.component";
import { MessageService } from "primeng/api";
import { of } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ThroughputsService {
  local_devices: string = "";
  remote_devices: string = "";
  IRCNETypeID: string = "";
  ip: string;
  portlink: portlink[];
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.portlink = [
      {
        alarm_count: 8,
        strDeviceName: "[sb-srio-ac-is2110-8]",
        strLocation: "6<%>",
        strName: "port link down",
        strDesc: "LINK-to-Witelcom"
      },
      {
        alarm_count: 6,
        strDeviceName: "[5030063663] RC551E-4GE Mainboard",
        strLocation: "Client 2<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 4,
        strDeviceName: "[sb-srio-ac-is2110-8]",
        strLocation: "7<%>",
        strName: "port link down",
        strDesc: "LINK-to-Witelcom"
      },
      {
        alarm_count: 3,
        strDeviceName: "[sb-coto-ac-rc551e-1] RC551E-4GE Mainboard",
        strLocation: "Client 2<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 3,
        strDeviceName: "[sb-ibaco-ac-is2110-1]",
        strLocation: "6<%>",
        strName: "port link down",
        strDesc: "port 6"
      },
      {
        alarm_count: 3,
        strDeviceName: "[cb-GBAA21048] RC551E-4GE Mainboard",
        strLocation: "Client 2<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 3,
        strDeviceName: "[GBAA10018_Phayuha] RC551E-4GE Mainboard",
        strLocation: "Client 3<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 2,
        strDeviceName: "[GBAA10055]",
        strLocation: "6<%>",
        strName: "port link down",
        strDesc: "--"
      },
      {
        alarm_count: 2,
        strDeviceName: "[cb-GBAA21050] RC551E-4GE Mainboard",
        strLocation: "Client 2<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 2,
        strDeviceName: "[nw-kprs-ac-rc551e-4] RC551E-4GE Mainboard",
        strLocation: "Client 1<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 2,
        strDeviceName: "[sb-anko-ac-is2110-1]",
        strLocation: "1<%>",
        strName: "port link down",
        strDesc: "INTRANET"
      },
      {
        alarm_count: 2,
        strDeviceName: "[sb-anko-ac-is2110-1]",
        strLocation: "4<%>",
        strName: "port link down",
        strDesc: "INTRANET"
      },
      {
        alarm_count: 2,
        strDeviceName: "[sb-pspu-ac-is2110-1]",
        strLocation: "1<%>",
        strName: "port link down",
        strDesc: "Link-to-GIN155510"
      },
      {
        alarm_count: 1,
        strDeviceName: "[sb-ibaco-ac-is2110-1]",
        strLocation: "5<%>",
        strName: "port link down",
        strDesc: "port 5"
      },
      {
        alarm_count: 1,
        strDeviceName: "[GDI044616 - 1] RC551E-4GE Mainboard",
        strLocation: "Line 1<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 1,
        strDeviceName: "[GDI044616 - 2] RC551E-4GE Mainboard",
        strLocation: "Client 3<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 1,
        strDeviceName: "[kp-GIN050051] RC551E-4GE Mainboard",
        strLocation: "Client 2<%>",
        strName: "port link down",
        strDesc: ""
      },
      {
        alarm_count: 1,
        strDeviceName: "[kp-kpto-ac-r924-1]",
        strLocation: "26<%>",
        strName: "port link down",
        strDesc: "UpLink-to-Kp-Hospita-[10.210.7.5]P28"
      }
    ];
  }

  setLocalDevice(device: any, IRCNETypeID: any) {
    this.local_devices = device;
    this.IRCNETypeID = IRCNETypeID;
  }
  setRemoteDevice() {
    return this.http.get<any>(`${environment.apiUrl}/device/cfm_remote`);
  }
  getdeviceInformation(res_id) {
    return this.http.get<any>(`${environment.baseUrl}switch/${res_id}`);
  }
  setRemoteDevice3() {
    return this.http.get<any>(`${environment.apiUrl}/device/cfm_remote`);
  }
  ShowCFM(ipaddress, username, password) {
    return this.http.get<any>(
      `${environment.apiUrl}/script/CFM?ipaddress=${ipaddress}&username=${username}&password=${password}`
    );
  }
  ShowLoopback(username, password, ipaddress, interface_remote) {
    return this.http.get<any>(
      `${environment.apiUrl}/script/loopback/show?username=${username}&password=${password}&IPADDRESS=${ipaddress}&interface=${interface_remote}`
    );
  }
  ShowethernetSAM(ipaddress, username, password) {
    return this.http.get<any>(
      `${environment.apiUrl}/script/ethernetsam?ipaddress=${ipaddress}&username=${username}&password=${password}`
    );
  }
  loadchart2() {
    return of(this.portlink);
  }
  createCFM(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.apiUrl}/script/CFM`, body, {
      headers: headers
    });
  }
  RemoveethernetSAM(data) {
    const header = { "content-type": "application/json" };
    const httpOptions = {
      headers: header,
      body: JSON.stringify(data)
    };
    return this.http.delete<any>(
      `${environment.apiUrl}/script/ethernetsam`,
      httpOptions
    );
  }
  RemoveInterface(data) {
    const header = { "content-type": "application/json" };
    const httpOptions = {
      headers: header,
      body: JSON.stringify(data)
    };
    return this.http.delete<any>(
      `${environment.apiUrl}/script/loopback/delete`,
      httpOptions
    );
  }
  Removeflowprofile(data) {
    const header = { "content-type": "application/json" };
    const httpOptions = {
      headers: header,
      body: JSON.stringify(data)
    };
    return this.http.delete<any>(
      `${environment.apiUrl}/script/flow-profile`,
      httpOptions
    );
  }
  Removebandwidthprofile(data) {
    const header = { "content-type": "application/json" };
    const httpOptions = {
      headers: header,
      body: JSON.stringify(data)
    };
    return this.http.delete<any>(
      `${environment.apiUrl}/script/bandwidth-profile`,
      httpOptions
    );
  }
  createCFM_ad(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.apiUrl}/script/CFM`, body, {
      headers: headers
    });
  }

  createLoopback(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.apiUrl}/script/loopback`, body, {
      headers: headers
    });
  }
  Createthroughputtestschedule(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http
      .post<any>(`${environment.apiUrl}/task/throughtput_test_schedule`, body, {
        headers: headers
      })
      .subscribe({
        next: data => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Create Schedule Successfuly",
            life: 3000
          });
        },
        error: error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.message
          });
          console.error("There was an error!", error);
        }
      });
  }

  createthroghtput(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/script/throughtput_test`,
      body,
      { headers: headers }
    );
  }
  Startthroughput(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/script/start_throughtput_test`,
      body,
      { headers: headers }
    );
  }

  ShowthroughputTestresult(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/script/show_throughtput_test_result`,
      body,
      { headers: headers }
    );
  }
  dropdownip() {
    return this.http.get<any>(
      `${environment.apiUrl}/device/throughtput_test_supported`
    );
  }

  loadchart(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/script/throughtput_test_report`,
      body,
      { headers: headers }
    );
  }
  // get from device model
  getPortName(portName) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    params = params.append("IRCNETNODEID", portName);
    return this.http.get<any>(
      `${environment.apiUrl}/device/throughtput_test_supported_updownlink`,
      {
        headers: headers,
        params: params
      }
    );
  }

  getSupportedVLAN(ip_local, ip_remote) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    params = params.append("ip_local", ip_local);
    params = params.append("ip_remote", ip_remote);
    return this.http.get<any>(
      `${environment.apiUrl}/device/throughtput_test_supported_vlan`,
      {
        headers: headers,
        params: params
      }
    );
  }

  getSupportedCATID(ip_local, ip_remote) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    params = params.append("ip_local", ip_local);
    params = params.append("ip_remote", ip_remote);
    return this.http.get<any>(
      `${environment.apiUrl}/device/throughtput_test_supported_catID`,
      {
        headers: headers,
        params: params
      }
    );
  }

  getSuggestedMEP(ip_local, ip_remote) {
    const headers = { "content-type": "application/json" };
    let params = new HttpParams();
    params = params.append("ip_local", ip_local);
    params = params.append("ip_remote", ip_remote);
    return this.http.get<any>(
      `${environment.apiUrl}/device/throughtput_test_suggest_mep`,
      {
        headers: headers,
        params: params
      }
    );
  }

  createThroughputNow(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    console.log(body);
    return this.http.post<any>(
      `${environment.apiUrl}/script/throughput_multi_test_now`,
      body,
      { headers: headers }
    );
  }

  createThroughputSchedule(data) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(data);
    return this.http.post<any>(
      `${environment.apiUrl}/script/throughput_multi_test_schedule`,
      body,
      { headers: headers }
    );
  }
}
