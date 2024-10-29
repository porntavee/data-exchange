import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subject } from "rxjs";
import { environment } from "environments/environment";

declare var google: any;

@Injectable()
export class TopoService {
  icon_path = `${environment.apiUrl}/icons`;
  defualt_icon_path = `${environment.apiUrl}/icons/symbol/noicon.png`;
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
      fillColor: "#FFFFFF",
      fillOpacity: 0.2,
      marker_ids: [12, 13, 14, 15],
      area_id: 1
    })
  ];

  constructor(private http: HttpClient) {}

  oninit() {}
  getNoicon() {
    return `https://edims.cathosting.in.th/icons/symbol/noicon.png`;
  }
  getPosition() {
    const headers = { "content-type": "application/json" };
    return this.http.get<any>(
      environment.apiUrl + "/device/82157/topo_mainview",
      {
        headers: headers
      }
    );
  }

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
  get_topo_information(id) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/${id}/nodeWithLink`
    );
  }
  getFilesMain() {
    return this.http.get<any>('assets/files.json')
  }
  setTopoInformation(symbol_id, lat, log, icon, topo_icon) {
    let params = new HttpParams();
    params = params.append("latitude", lat);
    params = params.append("longitude", log);
    params = params.append("icon", icon);
    params = params.append("topo_icon", topo_icon);
    return this.http.put<any>(
      `${environment.apiUrl}/device/${symbol_id}/update_location`,
      "{}",
      { params: params }
    );
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

  vlan_search(vlan_id: string, vlan_names: string[]) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      vlan_id: vlan_id,
      vlan_names: vlan_names,
    });
    return this.http.post<any>(
      environment.apiUrl + "/sed_vlan_detail/search",
      body,
      { headers: headers }
    );
  }
}
