import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { MenuItem } from "primeng/api";
import { of, Subject } from "rxjs";

import { User } from "./user";
declare var google: any;

@Injectable()
export class MapTopoService {
  icon_path = `${environment.baseUrl}icons`;
  defualt_icon_path = `${environment.baseUrl}icons/symbol/noicon.png`;

  defualt_markers: Subject<any> = new Subject();
  dummy_marker = [
    new google.maps.Marker({
      position: { lat: 13.815533132763905, lng: 100.73585869251217 },
      title: "Minburi",
      id: 12
    }),
    new google.maps.Marker({
      position: { lat: 14.055911953088579, lng: 100.61864090294362 },
      title: "KLONGLUANG",
      id: 13
    }),
    new google.maps.Marker({
      position: { lat: 13.7181973211355, lng: 100.48143694433787 },
      title: "THONBURI",
      id: 14
    }),
    new google.maps.Marker({
      position: { lat: 13.571345103642269, lng: 100.3212809904173 },
      title: "Samutsakorn",
      id: 15
    }),
    new google.maps.Polygon({
      paths: [
        { lat: 13.815533132763905, lng: 100.73585869251217 },
        { lat: 14.055911953088579, lng: 100.61864090294362 },
        { lat: 13.7181973211355, lng: 100.48143694433787 },
        { lat: 13.571345103642269, lng: 100.3212809904173 }
      ],
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: "#1976D2",
      fillOpacity: 0.2,
      marker_ids: [12, 13, 14, 15],
      area_id: 1
    })
  ];

  constructor(private http: HttpClient) {
    this.defualt_markers.next(this.get_marker_information(0));
  }

  oninit() {}

  get_marker_information(id) {
    return this.http.get<any>(`${environment.apiUrl}/device/${id}/node`);
  }

  get_link_information(id) {
    return this.http
      .get<any>(`${environment.apiUrl}/device/${id}/link`)
      .toPromise()
      .then(res => {
        return <any>res;
      });
  }

  get_CPU_Load(ip, username, password) {
    return this.http
      .get<any>(
        `${environment.apiUrl}/device/${ip}/cpu_load?username=${username}&password=${password}`
      )
      .toPromise()
      .then(res => {
        return <any>res;
      });
  }

  get_Memory(ip, username, password) {
    return this.http
      .get<any>(
        `${environment.apiUrl}/device/${ip}/memory?username=${username}&password=${password}`
      )
      .toPromise()
      .then(res => {
        return <any>res;
      });
  }

  vlan_search_dummy(vlan: string, vlam_name: string[]) {
    return [
      {
        SYMBOL_ID: 77307,
        SYMBOL_NAME1: "Device 1",
        SYMBOL_NAME3: "10.209.47.2",
        latitude: 13.073249816894532,
        longitude: 101.08708190917969,
        icon_path: "/device/iscomrax.gif",
        RES_ID: "1158",
        data: [
          {
            port: "port 25",
            vlan_name: "MANAGEMENT-CPE",
            vlan: "68"
          }
        ]
      },
      {
        SYMBOL_ID: 83792,
        SYMBOL_NAME1: "Device 2",
        SYMBOL_NAME3: "10.209.47.2",
        latitude: 13.163082122802735,
        longitude: 100.92704010009766,
        icon_path: "/device/iscomrax.gif",
        RES_ID: "2224",
        data: [
          {
            port: "port 19",
            vlan_name: "MANAGEMENT-CPE",
            vlan: "68"
          }
        ]
      },
      {
        SYMBOL_ID: 88674,
        SYMBOL_NAME3: "10.208.127.90",
        SYMBOL_NAME1: "Device 3",
        latitude: 13.662991523742676,
        longitude: 100.65151977539063,
        icon_path: "/device/iscomrax.gif",
        RES_ID: "2597",
        data: [
          {
            port: "port 46",
            vlan_name: "nms_raisecom",
            vlan: "68"
          },
          {
            port: "port 47",
            vlan_name: "nms_raisecom",
            vlan: "68"
          },
          {
            port: "port 48",
            vlan_name: "nms_raisecom",
            vlan: "68"
          }
        ]
      }
    ];
    const headers = { accept: "application/json" };

    return this.http.get<any>("${environment.apiUrl}/api/v1/device/");
  }

  vlan_search(vlan: string, vlam_names: string[]) {
    let params = new HttpParams();
    if (vlan && vlan != "") {
      params = params.append("vlan_id", vlan);
    }

    for (var index in vlam_names) {
      //console.log(vlam_names[index]);
      params = params.append("vlan_names", vlam_names[index]);
    }
    return this.http.get<any>(`${environment.apiUrl}/device/vlan`, {
      params: params
    });
  }
}
