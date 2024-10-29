import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { data, map } from "jquery";
import { from, Observable, of } from "rxjs";
import { portlink, portlink24 } from "@app/pages/topchart/topchart.component";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class TopchartService {
  icon_path = environment.baseUrl + "icons";
  defualt_icon_path = environment.baseUrl + "icons/symbol/city.png";
  loadalram_interval: any;

  portlink: portlink[];
  portlink24: portlink24[];

  constructor(private http: HttpClient) {
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

  loadchart() {
    return this.http.get<any>(
      `${environment.apiUrl}/alarm/today_port_link_down`
    );
    // return of(this.portlink);
  }
  loadchart24() {
    return this.http.get<any>(`${environment.apiUrl}/alarm/top_node_down`);
    //return of(this.portlink24);
  }
  loadchartremote24() {
    return this.http.get<any>(
      `${environment.apiUrl}/alarm/top_remote_power_off`
    );
    //return of(this.portlink24);
  }
  loadchartremote() {
    return this.http.get<any>(
      `${environment.apiUrl}/alarm/today_remote_power_off`
    );
    // return of(this.portlink);
  }
}
