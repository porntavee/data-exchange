import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { map } from "rxjs/operators";
import {
  LineGroup,
  alarmGroup,
  editGroup
} from "@app/pages/line/line.component";
import { from, of } from "rxjs";
import { BehaviorSubject } from "rxjs";
@Injectable()
export class LineGroupService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  alarmGroup: alarmGroup[];

  constructor(private http: HttpClient) {
    this.alarmGroup = [
      {
        group_id: 2,
        symbol_id: 102,
        group_name: "KLONGLUANG",
        symbol_name: "KLONGLUANG",
        group_description: "alarm from KLONGLUANG",
        symbol_list: ["KLONGLUANG"]
      }
    ];
  }
  valueSource(item) {
    this.messageSource.next(item);
  }
  getGroupMessageinfo(id) {
    return this.http.get<any>(
      `${environment.apiUrl}/line/group_message_info?group_id=${id}`
    );
  }
  getLineGroupInfo() {
    return this.http.get<LineGroup[]>(environment.apiUrl + "/line/group_info");
  }

  lineGroupChangeStatus(linegroup, status) {
    return this.http.put<LineGroup>(
      `${environment.apiUrl}/line/${linegroup}/enable_group?enable=${status}`,
      {}
    );
  }
  searchSymbolByName(param) {
    return this.http.get(
      `${environment.apiUrl}/device/get_symbol?symbol_name=${param}`
    );
  }
  searchSymbolByIP(param) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/get_symbol?ip_address=${param}`
    );
  }

  getMessageGroup() {
    return this.http.get<any>(`${environment.apiUrl}/line/message_group`);
  }

  createMessageGroup(symbol_id, name, description, flag, email, interval_time) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      symbol_id: symbol_id,
      group_name: name,
      description: description,
      flag: flag,
      email: email,
      interval_time: interval_time
    });
    return this.http.post<any>(
      environment.apiUrl + "/line/create_new_group",
      body,
      { headers: headers }
    );
  }

  editMessageGroup(
    id,
    symbol_id,
    name,
    description,
    flag,
    email,
    interval_time
  ) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      symbol_id: symbol_id,
      group_name: name,
      description: description,
      flag: flag,
      email: email,
      interval_time: interval_time
    });
    return this.http.post<any>(
      `${environment.apiUrl}/line/edit_group?group_id=${id}`,
      body,
      { headers: headers }
    );
  }
  deleteMessageGroup(id) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify;
    return this.http.post<any>(
      `${environment.apiUrl}/line/delete_group?group_id=${id}`,
      body,
      { headers: headers }
    );
  }
}
