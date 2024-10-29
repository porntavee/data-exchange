import { HttpClient ,HttpParams} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { data, map } from "jquery";
import { BehaviorSubject,from, Observable, of } from "rxjs";
import {
  Alarmstatistices,
  Alarmlist,
  Alarmcount,
  AlarmMarker,
  portlink,
  portlink24
} from "./alarmlog";
import { environment } from "environments/environment";
import { MessageService, ConfirmationService } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class GetalarmlogServiceService {
  icon_path = `${environment.apiUrl}/icons`;
  defualt_icon_path = `${environment.apiUrl}/icons/symbol/city.png`;
  loadalram_interval: any;
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  alarm_data: Alarmstatistices;
  alarm_count: Alarmcount = {};
  alarm_list: Alarmlist[];
  portlink: portlink[];
  portlink24: portlink24[];
  portlinks: portlink = {};
  portlink_alarm_count: number[] = [];
  portlink_Device: any[] = [];
  portlink_strDesc: any[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.alarm_data = {
      alarm_count: {
        total_alarm: 0,
        critical_alarm: 0,
        major_alarm: 0,
        minor_alarm: 0,
        warning_alarm: 0,
        unknown_alarm: 0
      },
      alarm_list: []
    };
    this.portlink24 = [
      {
        alarm_count: 29,
        symbol_name1: "Saraburi"
      },
      {
        alarm_count: 8,
        symbol_name1: "Chaibadan"
      },
      {
        alarm_count: 6,
        symbol_name1: "Uthai Thani"
      },
      {
        alarm_count: 5,
        symbol_name1: "Ayutthaya"
      },
      {
        alarm_count: 4,
        symbol_name1: "NakhonSawan"
      },
      {
        alarm_count: 3,
        symbol_name1: "Singburi"
      },
      {
        alarm_count: 3,
        symbol_name1: "Lopburi"
      },
      {
        alarm_count: 2,
        symbol_name1: "Angthong."
      },
      {
        alarm_count: 2,
        symbol_name1: "Pichit"
      }
    ];
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

  loadStattisticAlarm() {
    return this.http.get<Alarmstatistices>(
      `${environment.apiUrl}/alarm/statistics`
    );
  }
  alarm_historybetween(start, end) {
    const headers = { 'content-type': 'application/json'}  
    let params = new HttpParams();
    if(start && start!=""){
      params = params.append('start', start);
    }
    if(end && end!=""){
      params = params.append('end', end);
    }
    return this.http.get<any>(environment.apiUrl+'/alarm_history/between',{'headers':headers,params:params});
  }
  alarm_history() {
    return this.http.get<any>(`${environment.apiUrl}/alarm_history/current`);
  }
  directIP(ip) {
    this.messageSource.next(ip);
  }
  count_history() {
    return this.http.get<any>(
      `${environment.apiUrl}/alarm/alarm_count_history`
    );
  }
  loadAlarmMakers() {
    return this.http.get<any>(`${environment.apiUrl}/device/alarm_map`);
  }

  loadDeviceStatusNumber() {
    return this.http.get<any>(
      `${environment.apiUrl}/device/device_status_number`
    );
  }

  loadBackupNumber() {
    return this.http.get<any>(`${environment.apiUrl}/device/backup_number`);
  }

  loadActivePort() {
    return this.http.get<any>(`${environment.apiUrl}/device/active_port`);
  }

  loadBandwidthStatus() {
    return this.http.get<any>(
      `${environment.apiUrl}/device/bandwidth_status_trunk`
    );
  }

  loadaccessBandwidthStatus() {
    return this.http.get<any>(
      `${environment.apiUrl}/device/bandwidth_status_access`
    );
  }
  loadVlanCount() {
    return this.http.get<any>(`${environment.apiUrl}/device/vlan_count`);
  }

  loadTaskCount() {
    return this.http.get<any>(`${environment.apiUrl}/task/task_count`);
  }

  loadLineGroupsStatus() {
    return this.http.get<any>(`${environment.apiUrl}/line/group_status`);
  }

  loadLineMessagesent() {
    return this.http.get<any>(`${environment.apiUrl}/line/sent_alarm_count`);
  }

  loadSymbolSettingNumber() {
    return this.http.get<any>(`${environment.apiUrl}/device/count_uncompleted`);
  }
  loadchart() {
    return this.http.get<any>(`${environment.apiUrl}/alarm/today_port_link_down`);
    // return of(this.portlink);
  }
  loadchart24(){
    return this.http.get<any>(`${environment.apiUrl}/alarm/top_node_down`);
    //return of(this.portlink24);
  }
  loadchartremote24(){
    return this.http.get<any>(`${environment.apiUrl}/alarm/top_remote_power_off`);
    //return of(this.portlink24);
  }
  loadchartremote() {
    return this.http.get<any>(`${environment.apiUrl}/alarm/today_remote_power_off`);
    // return of(this.portlink);
  }
  searchSymbolByName(param) {
    return this.http.get<any>(`${environment.apiUrl}/device/get_symbol?symbol_name=${param}`)
}
searchSymbolByIP(param) {
  return this.http.get<any>(`${environment.apiUrl}/device/get_symbol?ip_address=${param}`)
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
getRangeBandwidth(ip_addr,start,end,if_index) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    start : start,
    end : end,
    if_index : if_index
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getRangeBandwidth`,
    body,
    { headers: headers }
  );
}
getRangeMemory(ip_addr,start,end) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    start : start,
    end : end
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getRangeMemory`,
    body,
    { headers: headers }
  );
}
getRangeCPU(ip_addr,start,end) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    start : start,
    end : end,
    load_x_min:2
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getRangeCPU`,
    body,
    { headers: headers }
  );
}
getRangeTemp(ip_addr,start,end) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    start : start,
    end : end
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getRangeTemp`,
    body,
    { headers: headers }
  );
}
getTemp(ip_addr) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getTemp`,
    body,
    { headers: headers }
  );
}
getRangeVolt(ip_addr,start,end) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    start : start,
    end : end
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getRangeVoltAll`,
    body,
    { headers: headers }
  );
}
getCPU(ip_addr,load_x_min) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr,
    load_x_min:load_x_min
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getCPU`,
    body,
    { headers: headers }
  );
}
getMemory(ip_addr) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    ip_addr: ip_addr
  });
  return this.http.post<any>(
    `${environment.serviceURL}/getMemory`,
    body,
    { headers: headers }
  );
}
getTop5device(time){
  return this.http.get<any>(`${environment.apiUrl}/alarm_trap_history/alarm_count_history/${time}`)
}
getAlarmTrapHistory(page,limit,start, end, ip) {
  const headers = { "content-type": "application/json" };
  const body = JSON.stringify({
    page: page,
    limit:limit,
    start:start,
    end:end,
    ip:ip
  });
  return this.http.post<any>(
    environment.apiUrl + "/alarm_trap_history",
    body,
    { headers: headers }
  );
}
}
