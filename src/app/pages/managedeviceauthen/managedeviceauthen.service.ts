import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { data } from 'jquery';
import { BehaviorSubject } from "rxjs";

import { from, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ManagedeviceauthenService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  private messageSourceMenu = new BehaviorSubject(undefined);
  currentMessageMenu = this.messageSourceMenu.asObservable();
  constructor(private http: HttpClient) {
   
  }

  valueSource(item){
    this.messageSource.next(item)
  }
  valueSourceMenu(item){
    this.messageSourceMenu.next(item)
  }
  getProfile() {
    const headers = { 'accept': 'application/json' }

    return this.http.get<any>(environment.apiUrl + '/device_authen/profile', { 'headers': headers });
  }
  getdropdown_list() {
    const headers = { 'accept': 'application/json' }

    return this.http.get<any>(environment.apiUrl + '/device_management/dropdown_list', { 'headers': headers });
  }
  getNode() {
    const headers = { 'accept': 'application/json' }
  //   let params = new HttpParams()
  //   if(limit && limit!=""){
  //     params = params.append('limit', limit);
  // }
    return this.http.get<any>(environment.apiUrl + '/device_management/node_list?limit=0',  {'headers':headers});
  }
  getNodeother() {
    const headers = { 'accept': 'application/json' }
  //   let params = new HttpParams()
  //   if(limit && limit!=""){
  //     params = params.append('limit', limit);
  // }
    return this.http.get<any>(environment.apiUrl + '/device_management/node_list?limit=0&brand=cisco',  {'headers':headers});
  }
  getBrand() {
    const headers = { 'accept': 'application/json' }
    return this.http.get<any>(environment.apiUrl + '/device_authen/node/brand', { 'headers': headers });
  }
  getVlan() {
    const headers = { 'accept': 'application/json' }
    return this.http.get<any>(environment.apiUrl + '/device_authen/node/vlan', { 'headers': headers });
  }
  getProfileid(id) {
    const headers = { 'accept': 'application/json' }
    return this.http.get<any>(environment.apiUrl + '/device_authen/profile/' + id , { 'headers': headers });
  }
  TestLogin(){
    const headers = { "content-type": "application/json" };
    // const body = JSON.stringify({
    //  profileid
    // });
    return this.http.post<any>(
      `${environment.apiUrl}/device_authen/node/test-login`,
      { headers: headers }
    );
  }
  editProfileid(id,profileid) {
    const headers = { "content-type": "application/json" };
    // const body = JSON.stringify({
    //  profileid
    // });
    return this.http.put<any>(
      `${environment.apiUrl}/device_authen/profile/${id}`,
      profileid,
      { headers: headers }
    );
  }
  removeNode(id){
    return this.http.delete<any>(`${environment.apiUrl}/device_management/remove?id=${id}`)
  }
  editNodeid(id,nodeid,snmp_profile_id) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      id:id,
      device_profile_id:nodeid,
      snmp_profile_id:snmp_profile_id,
    });
    return this.http.put<any>(
      `${environment.apiUrl}/device_management/basic_update`,
      body,
      { headers: headers }
    );
  }
  updateNodeid(bodylist) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      id : bodylist.id,
      device_name:bodylist.device_name,
      device_profile_id:bodylist.device_profile_id,
      snmp_profile_id:bodylist.snmp_profile_id,
      management_vlan:bodylist.management_vlan,
      ip_address:bodylist.ip_address,
      brand:bodylist.brand,
      model:bodylist.model
    });
    return this.http.put<any>(
      `${environment.apiUrl}/device_management/update`,
      body,
      { headers: headers }
    );
  }
  editAllNodeid(brand,nodeid,vlan) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      brand:brand,
      device_profile_id:nodeid,
      vlan:vlan
    });
    return this.http.put<any>(
      `${environment.apiUrl}/device_authen/node/all`,
      body,
      { headers: headers }
    );
  }
  insertdevice(device_name,ip_address,brand,model,device_profile_id,snmp_profile_id) {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify({
      device_name:device_name,
      ip_address:ip_address,
      brand:brand,
      model:model,
      device_profile_id:device_profile_id,
      snmp_profile_id:snmp_profile_id
    });
    return this.http.post<any>(
      `${environment.apiUrl}/device_management/insert`,
      body,
      { headers: headers }
    );
  }
  addProfileid(profileidadd) {
    const headers = { "content-type": "application/json" };
    // const body = JSON.stringify({
    //  profileid
    // });
    return this.http.post<any>(
      `${environment.apiUrl}/device_authen/profile`,
      profileidadd,
      { headers: headers }
    );
  }
}


