import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { LineGroup, alarmGroup, editGroup } from '@app/pages/line/line.component';
import { from, of } from 'rxjs';
import { BehaviorSubject } from "rxjs";
@Injectable()
export class rightMenuService {
    alarmGroup: alarmGroup[];
    private messageSource = new BehaviorSubject(undefined);
    currentMessage = this.messageSource.asObservable();

    constructor(private http: HttpClient) {
        this.alarmGroup = [
            {
                "group_id": 2,
                "symbol_id": 102,
                "group_name": "KLONGLUANG",
                "symbol_name": "KLONGLUANG",
                "group_description": "alarm from KLONGLUANG",
                "symbol_list": [
                    "KLONGLUANG"
                ]
            }
        ]
    }
    valueSource(item){
        this.messageSource.next(item)
      }
    getGroupMessageinfo(id) {
        return this.http.get<any>(`${environment.apiUrl}/line/group_message_info?group_id=${id}`)
    }
    getLineGroupInfo() {
        return this.http.get<LineGroup[]>(environment.apiUrl + '/line/group_info')
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
    lineGroupChangeStatus(linegroup, status) {
        return this.http.put<LineGroup>(`${environment.apiUrl}/line/${linegroup}/enable_group?enable=${status}`, {})
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
    getMessageGroup() {
        return this.http.get<any>(`${environment.apiUrl}/line/message_group`)
    }


    createMessageGroup(symbol_id, name, description) {
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify({
            "symbol_id": symbol_id,
            "group_name": name,
            "description": description
        })
        return this.http.post<any>(environment.apiUrl + '/line/create_new_group', body, { 'headers': headers });
    }

    editMessageGroup(id, symbol_id, name, description) {

        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify({
            "symbol_id": symbol_id,
            "group_name": name,
            "description": description
        })
        // console.log(body)
        return this.http.post<any>(`${environment.apiUrl}/line/edit_group?group_id=${id}`, body, { 'headers': headers });
    }
    deleteMessageGroup(id) {

        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify
        return this.http.post<any>(`${environment.apiUrl}/line/delete_group?group_id=${id}`, body, { 'headers': headers });
    }

    createAlarmConfig(port: String, hour: Number, minute: Number, comVal: Number, comType: String, alarmType: any, data: any, zone_id: Number) {
        const headers = { 'content-type': 'application/json' }
        let payload: Array<Object> = []
        data.forEach(element => {
            if (port === undefined){
                port = ''
            }
            let temp: Object = {
                'ip': element.SYMBOL_NAME3,
                'symbolId': element.SYMBOL_ID,
                'port': port,
                'alarmType': alarmType.name,
                'compareType': comType,
                'compareValue': comVal,
                'interval': {
                    'hour': hour,
                    'minute': minute
                },
                'zone_id': zone_id
            }
            payload.push(temp)
        });
    // console.log(payload);

        const body = JSON.stringify({'alarm_list': payload})
        return this.http.post<any>(`${environment.apiUrl}/edims_config/alarm_config/`, body, { 'headers': headers });
    }
    getAlarmConfig(zone_id) {
        return this.http.get<any>(`${environment.apiUrl}/edims_config/alarm_config?zone_id=${zone_id}`)
    }
    EditAlarmConfig(port: String, hour: Number, minute: Number, comVal: Number, comType: String, alarmType: any, data: any, zone_id: any) {
        const headers = { 'content-type': 'application/json' }
        let params = new HttpParams();
        if (zone_id && zone_id != "") {
            params = params.append("zone_id", zone_id);
          }
        let payload: Array<Object> = []
        // console.log(data)
        // data.forEach(element => {
            if (port === undefined){
                port = ''
            }
            let temp: Object = {
                'ip': data.ip,
                'symbolId': data.symbolId,
                'port': port,
                'alarmType': alarmType.name,
                'compareType': comType,
                'compareValue': comVal,
                'interval': {
                    'hour': hour,
                    'minute': minute
                },
                'zone_id': zone_id
            }
            payload.push(temp)
        // });
    // console.log(payload);

    const body = JSON.stringify({'alarm_list': payload})
    return this.http.put<any>(`${environment.apiUrl}/edims_config/alarm_config/${data.id}`, body, { 'headers': headers,
    params: params });
    }
    deleteAlarmConfig(data: any, zone_id: any) {
        let params = new HttpParams();
        if (zone_id && zone_id != "") {
            params = params.append("zone_id", zone_id);
          }
        const header = { 'content-type': 'application/json' }
        const httpOptions = {
          headers: header,
          params: params
        //   body: JSON.stringify(data)
      };
        return this.http.delete<any>(`${environment.apiUrl}/edims_config/alarm_config/${data.id}`, httpOptions);
    }
}