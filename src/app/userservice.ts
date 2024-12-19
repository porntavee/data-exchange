import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { User } from "@app/user";
import { environment } from "environments/environment";
import { BehaviorSubject, forkJoin } from "rxjs";
@Injectable()
export class UserService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  private messageSourceZone = new BehaviorSubject(undefined);
  currentMessageZone = this.messageSourceZone.asObservable();
  constructor(private http: HttpClient) {}

  // getUser() {
  //     return this.http.get<any>('assets/user.json')
  //     .toPromise()
  //     .then(res => <User[]>res.data)
  //     .then(data => { return data; });
  // }
  valueSource(item) {
    this.messageSource.next(item);
  }
  valueSourceZone(item) {
    this.messageSourceZone.next(item);
  }
  getUser() {
    const headers = { accept: "application/json" };
    return this.http.get<any>(environment.loginURL + "/user/users", {
      headers: headers
    });
  }

  // loadUser(){
  //     return this.http.get<any>('http://192.168.1.230:8000/alarm/statistics')
  //     .toPromise()
  //     .then(res => <User[]>res.data)
  //     .then(data => { return data; });
  // }
  editZone(id, symbol_id, name, description) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      zone_name: name,
      zone_description: description,
      symbol_id: symbol_id
    });
    // console.log(body)
    return this.http.post<any>(
      `${environment.apiUrl}/user/edit_userzone?zone_id=${id}`,
      body,
      { headers: headers }
    );
  }
  deleteZone(id) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify;
    return this.http.post<any>(
      `${environment.loginURL}/user/delete_zone?zone_id=${id}`,
      body,
      { headers: headers }
    );
  }
  getUserZone() {
    const headers = { accept: "application/json" };
    return this.http.get<any>(environment.apiUrl + "/user/userzone", {
      headers: headers
    });
  }
  getUserZoneAssign() {
    const headers = { accept: "application/json" };
    return this.http.get<any>(environment.apiUrl + "/user/userzone_assign", {
      headers: headers
    });
  }
  get_topo_information(id) {
    return this.http.get<any>(
      `${environment.apiUrl}/device/${id}/nodeWithLink?filter=false`
    );
  }
  creteuserzone(userzone) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(userzone);
    return this.http.post<any>(environment.apiUrl + "/user/userzone", body, {
      headers: headers
    });
  }
  createUser(userdata) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(userdata);
    return this.http.post<any>(environment.loginURL + "/user/register", body, {
      headers: headers
    });
  }

  editUser(userdata: User) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(userdata);
    return this.http.put<User>(
      environment.loginURL + "/user/update/" + userdata.id,
      body,
      { headers: headers }
    );
  }

  deleteUsers(user_ids: number[]) {
    const headers = { "content-type": "application/json" };
    const deleteRequests = user_ids.map(user_id => {
      return this.http.delete(
        environment.loginURL + `/user/delete/${user_id}`,
        { headers: headers }
      );
    });

    // รอให้ทุกคำขอลบสำเร็จ
    return forkJoin(deleteRequests);
  }

  sendmail(email) {
    const headers = { "content-type": "application/json" };
    let payload = {
      receiver_email: email,
      message: `Subject:test api2\nAlarm ID 30367998
Level Major
First Report Time 2021-09-25 14:07:49
IP Address 10.208.12.95
Alarm name optical module performance parameter low alarm
NE name [10.208.12.95      pt-klgo-ag-r924-1#]
Device Type ISCOM2924GF-4C`
    };
    const body = JSON.stringify(payload);
    return this.http.post<any>(`${environment.apiUrl}/send_email`, body, {
      headers: headers
    });
  }
}
